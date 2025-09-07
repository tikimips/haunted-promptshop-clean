// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // we need the Node runtime (not edge) for file handling

function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return Buffer.from(binary, "binary").toString("base64");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const name = (form.get("name") as string | null) || "Untitled";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No image file received." }, { status: 400 });
    }

    // Convert uploaded file to a data URL
    const mime = file.type || "image/png";
    const b64 = toBase64(await file.arrayBuffer());
    const dataUrl = `data:${mime};base64,${b64}`;

    // If there's no key (or on preview envs), return a graceful local prompt
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      const prompt =
        `(${name}) — A clear, single-sentence generative prompt describing the uploaded image’s subject, style, colors, lighting, and composition.`;
      return NextResponse.json({ prompt, name }, { status: 200 });
    }

    const openai = new OpenAI({ apiKey: key });

    // Use GPT-4o-mini with image input (chat.completions style for broad compat)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "You are a prompt-writer for an AI art app. " +
                "Analyze this image and produce ONE concise, high-quality prompt that recreates it. " +
                "Include subject, scene details, art style, materials, camera/lighting if relevant, " +
                "and a short color palette. No preambles, no quotes."
            },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ]
    });

    const prompt =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Elegant, cinematic prompt describing the image (fallback).";
    return NextResponse.json({ prompt, name }, { status: 200 });
  } catch (err: any) {
    console.error("generate-prompt error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to generate prompt. Please try again." },
      { status: 500 }
    );
  }
}
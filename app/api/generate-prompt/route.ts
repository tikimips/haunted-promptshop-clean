import { NextRequest, NextResponse } from "next/server";
import type { Prompt } from "@/app/types";
import OpenAI from "openai";

// We’ll attempt OpenAI, but keep TS happy and fall back if the SDK version differs.
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const name = (form.get("name") as string | null) || "Untitled";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString("base64");
    const dataUrl = `data:${file.type};base64,${b64}`;

    let promptText = `A reusable prompt based on the uploaded image. Describe style, composition, palette, and subject; generate a concise, generalizable prompt.`;

    if (openai) {
      try {
        // Use 'any' to avoid compile-time errors across OpenAI SDK versions.
        const client: any = openai as any;

        if (client.responses?.create) {
          // New Responses API (SDK v4)
          const r = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            input: [
              {
                role: "user",
                content: [
                  { type: "input_text", text: "Analyze the image and craft a reusable prompt a designer can reuse." },
                  { type: "input_image", image_url: dataUrl },
                ],
              },
            ],
          });
          promptText = r.output_text ?? promptText;
        } else if (client.chat?.completions?.create) {
          // Chat Completions fallback (older SDKs)
          const r = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Analyze the image and craft a reusable prompt a designer can reuse." },
                  { type: "image_url", image_url: dataUrl },
                ] as any,
              },
            ],
          });
          promptText = r.choices?.[0]?.message?.content || promptText;
        }
      } catch (e) {
        console.error("OpenAI generation failed, using fallback:", e);
      }
    }

    const out: Prompt = {
      id: `gen-${Date.now()}`,
      title: name,
      author: "You",
      description: "Generated from your image.",
      imageUrl: dataUrl,
      promptText,
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(out);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
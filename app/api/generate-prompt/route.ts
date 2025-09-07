// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

// We accept multipart/form-data with fields: file (image), name (string)
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const name = String(form.get("name") || "Untitled");

  if (!file) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set in your environment." },
      { status: 400 }
    );
  }

  // Minimal Vision call via OpenAI REST (no SDK) – prompt extraction
  // You can replace the body with your preferred model parameters.
  let promptText = "";
  try {
    const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this image and write a single best creative prompt the user can reuse to recreate it in a generative model. Keep it concise but specific.` },
            { type: "image_url", image_url: { url: `data:${file.type};base64,${b64}` } },
          ],
        },
      ],
      max_tokens: 250,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error?.message || "OpenAI API error";
      return NextResponse.json({ error: msg }, { status: res.status });
    }
    promptText = data.choices?.[0]?.message?.content?.trim() || "";
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to call OpenAI." }, { status: 500 });
  }

  const id = crypto.randomUUID();
  const imageUrl = URL.createObjectURL(file as any); // not persisted server side; client will save local fields

  const saved: Prompt = {
    id,
    title: name,
    author: "You",
    description: "Generated from your image.",
    imageUrl,
    prompt: promptText,
    favorite: false,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ prompt: saved });
}
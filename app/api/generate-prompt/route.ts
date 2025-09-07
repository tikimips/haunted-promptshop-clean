// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_PUBLIC;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { imageDataUrl, title } = await req.json();

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ error: "imageDataUrl (data URL) required" }, { status: 400 });
    }

    // Ask OpenAI to write a clean, copy-ready prompt that matches the style of the image.
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, high-quality image-generation prompts in one paragraph. Avoid disclaimers. Include medium, lighting, composition, and style cues.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Create a copy-ready image-generation prompt inspired by this reference image. Title: ${title || "Untitled"}` },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.7,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const data = await r.json();
    const promptText: string =
      data?.choices?.[0]?.message?.content?.trim?.() || "A high-fidelity prompt based on your image.";

    // Return a normalized Prompt object (client will handle saving later)
    return NextResponse.json({
      id: crypto.randomUUID(),
      title: title || "Untitled",
      author: "You",
      description: "Generated from your image.",
      imageUrl: imageDataUrl,
      promptText,
      favorite: false,
      createdAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
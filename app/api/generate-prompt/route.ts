import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// File → data URL
async function fileToDataURL(file: File): Promise<string> {
  const arrayBuf = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuf).toString("base64");
  const mime = file.type || "image/png";
  return `data:${mime};base64,${base64}`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const form = await req.formData();
    const name = (form.get("name") as string) || "Untitled";
    const notes = (form.get("notes") as string) || "";
    const imageFile = form.get("image") as File | null;

    let imagePart: any = null;
    let imageUrl = "";
    if (imageFile && typeof imageFile === "object") {
      imageUrl = await fileToDataURL(imageFile);
      imagePart = { type: "image_url", image_url: { url: imageUrl } };
    }

    const messages: any[] = [
      {
        role: "system",
        content:
          "You are a prompt refiner. Return a single, reusable prompt for design/imagery generation. One paragraph. No preamble, no quotes.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: notes || "Analyze the image and produce a reusable prompt." },
          ...(imagePart ? [imagePart] : []),
        ],
      },
    ];

    const chat = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.6,
    });

    const promptText = chat.choices?.[0]?.message?.content?.trim() || "";

    const prompt = {
      id: crypto.randomUUID(),
      title: name,
      author: "You",
      description: "Generated from your image/notes.",
      imageUrl,
      promptText,
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ prompt });
  } catch (err: any) {
    console.error("generate-prompt error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate prompt." },
      { status: 500 }
    );
  }
}
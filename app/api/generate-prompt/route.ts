import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // use Node runtime so Buffer/crypto are available

// Util: convert a File to a data URL (server-side)
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

    // Build image part (optional)
    let imagePart: any = null;
    let imageUrl = "";
    if (imageFile && typeof imageFile === "object") {
      imageUrl = await fileToDataURL(imageFile);
      // Chat Completions vision: use the image_url content part
      imagePart = { type: "image_url", image_url: { url: imageUrl } };
    }

    const system =
      "You are a prompt refiner. Given an image and/or short notes, return a concise, reusable prompt suitable for design/imagery generation. Keep it one paragraph. No preamble, no lists, no quotes.";

    const userText =
      notes?.trim() ||
      "Analyze the image and return a single reusable prompt. No preamble.";

    const messages: any[] = [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
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
      imageUrl, // empty string if none
      promptText, // <-- front-end should read this field
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
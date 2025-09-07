import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = (form.get("name") as string) || "Untitled";
    const file = form.get("file") as File | null;
    const note = (form.get("note") as string) || "";

    if (!file && !note) {
      return NextResponse.json({ error: "No image or note provided." }, { status: 400 });
    }

    let dataUrl: string | undefined;
    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      const mime = file.type || "image/png";
      dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You turn an input image (and optional user note) into a reusable prompt for future image generation. Keep it under 140 words. Include style cues, subject, lighting, lens or camera if obvious, and color palette."
      },
      {
        role: "user",
        content: [
          { type: "text", text: note || "Analyze the image and produce a reusable, generalizable prompt." },
          ...(dataUrl
            ? [{ type: "image_url" as const, image_url: { url: dataUrl } }]
            : [])
        ]
      }
    ];

    const chat = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    const text = chat.choices[0]?.message?.content?.trim() || "A versatile prompt based on the image.";

    return NextResponse.json({
      ok: true,
      promptText: text,
      name
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Generation failed" }, { status: 500 });
  }
}
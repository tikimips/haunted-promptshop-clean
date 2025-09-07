// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // keep this on edge

// Helper: turn a Blob into a data URL string (Edge-safe)
async function blobToDataURL(b: Blob): Promise<string> {
  const array = new Uint8Array(await b.arrayBuffer());
  let binary = "";
  for (let i = 0; i < array.length; i++) binary += String.fromCharCode(array[i]);
  const base64 = btoa(binary);
  return `data:${b.type || "application/octet-stream"};base64,${base64}`;
}

export async function POST(req: Request) {
  try {
    // Expecting multipart/form-data from the client
    const form = await req.formData();

    const title = (form.get("title") as string) || "Untitled";
    const notes = (form.get("notes") as string) || "";
    const imageUrlFromForm = (form.get("imageUrl") as string) || "";

    // Image can arrive either as a file (Blob) or a string URL
    const imageFile = form.get("image") as File | null;

    let imagePart:
      | { type: "input_image"; image_url: string }
      | { type: "input_image"; image_url: string } // same shape, different branch
      | null = null;

    if (imageFile && typeof imageFile === "object") {
      const dataUrl = await blobToDataURL(imageFile);
      imagePart = { type: "input_image", image_url: dataUrl };
    } else if (imageUrlFromForm) {
      imagePart = { type: "input_image", image_url: imageUrlFromForm };
    }

    if (!imagePart) {
      return NextResponse.json(
        { error: "No image provided. Supply `image` (file) or `imageUrl` (string)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // Build a single-turn vision prompt using chat.completions (v4 SDK)
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a prompt engineer. Given an image and optional user notes, craft a single, reusable, high-quality text prompt the user can paste into a generative model. Be concise, but specific. Include style cues (medium, lighting, mood, lenses, materials) only if relevant.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `Analyze this image and produce a single best reusable prompt suitable for generating **new** images in a similar style/subject.\n` +
              `Title: ${title}\n` +
              (notes ? `User notes: ${notes}\n` : "") +
              `Output ONLY the prompt text — no preamble, no bullet points, no quotes.`,
          },
          imagePart,
        ],
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
    });

    const promptText =
      completion.choices?.[0]?.message?.content?.trim() || "A refined prompt could not be generated.";

    // Respond with the generated prompt text; your client saves it to localStorage and UI
    return NextResponse.json({ promptText });
  } catch (err: any) {
    console.error("generate-prompt error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error generating prompt." },
      { status: 500 }
    );
  }
}
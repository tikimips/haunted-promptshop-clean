import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

async function blobToDataURL(b: Blob): Promise<string> {
  const bytes = new Uint8Array(await b.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${b.type || "application/octet-stream"};base64,${base64}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const title = (form.get("title") as string) || "Untitled";
    const notes = (form.get("notes") as string) || "";
    const imageUrlFromForm = (form.get("imageUrl") as string) || "";
    const imageFile = form.get("image") as File | null;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

<<<<<<< HEAD
    let imagePart: any = null;
=======
    // Build the image content (typed loosely to avoid SDK type drift)
    let imagePart: any = null;
>>>>>>> ad6673cd580a1768d874c408e62b2581b1935a9a
    if (imageFile && typeof imageFile === "object") {
      const dataUrl = await blobToDataURL(imageFile);
      imagePart = { type: "image_url", image_url: { url: dataUrl } };
    } else if (imageUrlFromForm) {
      imagePart = { type: "image_url", image_url: { url: imageUrlFromForm } };
    }

    if (!imagePart) {
      return NextResponse.json(
        { error: "No image provided. Send a file 'image' or a string 'imageUrl'." },
        { status: 400 }
      );
    }

    const userText = `Analyze this image and produce a single, reusable prompt suitable for generating new images in a similar style/subject.
Title: ${title}
${notes ? `User notes: ${notes}\n` : ""}Output ONLY the prompt text — no preamble, no bullet points, no quotes.`;

    const messages: any[] = [
      {
        role: "system",
        content:
          "You are a prompt engineer. Given an image and optional user notes, craft ONE concise, specific, high-quality text prompt the user can paste into a generative model.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
<<<<<<< HEAD
          imagePart,
=======
          ...(imagePart ? [imagePart] : []),
>>>>>>> ad6673cd580a1768d874c408e62b2581b1935a9a
        ],
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
    });

    const promptText =
      completion.choices?.[0]?.message?.content?.trim() ||
      "A refined prompt could not be generated.";

    return NextResponse.json({ promptText });
  } catch (err: any) {
    console.error("generate-prompt error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error generating prompt." },
      { status: 500 }
    );
  }
}
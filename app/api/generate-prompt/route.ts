import { NextResponse } from "next/server";
import OpenAI, { type ChatCompletionContentPartImage } from "openai";

export const runtime = "edge";

// Convert a Blob/File to data URL (Edge-safe)
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

    const client = new OpenAI({ apiKey });

    // Build image content in the format required by OpenAI SDK v4
    let imagePart: ChatCompletionContentPartImage | null = null;

    if (imageFile && typeof imageFile === "object") {
      const dataUrl = await blobToDataURL(imageFile);
      imagePart = { type: "image_url", image_url: { url: dataUrl } };
    } else if (imageUrlFromForm) {
      imagePart = { type: "image_url", image_url: { url: imageUrlFromForm } };
    }

    if (!imagePart) {
      return NextResponse.json(
        { error: "No image provided. Supply `image` (file) or `imageUrl` (string)." },
        { status: 400 }
      );
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a prompt engineer. Given an image and optional user notes, craft a single, reusable, high-quality text prompt the user can paste into a generative model. Be concise but specific. Include style cues only if relevant.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
             
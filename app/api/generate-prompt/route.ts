// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = (form.get("name") as string) || "Untitled";
  const notes = (form.get("notes") as string) || "";

  const promptText = [
    `Create a detailed prompt for generating an image titled "${name}".`,
    notes ? `Incorporate these notes: ${notes}.` : "",
    "Describe subject, scene layout, camera/lens, lighting, palette, style references, mood, and post-processing.",
    "Return a single, copyable prompt string optimized for modern diffusion and VLM models."
  ].filter(Boolean).join(" ");

  return NextResponse.json({ promptText });
}
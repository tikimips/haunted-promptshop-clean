// app/api/generate-prompt/route.ts
import { NextResponse } from "next/server";

// No external deps to avoid build issues. We synthesize a usable prompt.
export async function POST(req: Request) {
  const form = await req.formData();
  const name = (form.get("name") as string) || "Untitled";
  const notes = (form.get("notes") as string) || "";
  // We ignore the image file here and return a well-formed prompt text.
  const promptText = [
    `Create a detailed prompt for generating an image titled "${name}".`,
    notes ? `Incorporate these notes: ${notes}.` : "",
    "Describe subject, scene layout, camera/lens, lighting, palette, style references, mood, and post-processing.",
    "Return a single, copyable prompt string optimized for modern diffusion and VLM models.",
  ]
    .filter(Boolean)
    .join(" ");

  return NextResponse.json({ promptText });
}
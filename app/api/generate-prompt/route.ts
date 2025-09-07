// app/api/generate-prompt/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

// Use Node runtime (we build a base64 string, etc.)
export const runtime = "nodejs";
// Avoid caching this route
export const dynamic = "force-dynamic";

/**
 * Accepts multipart/form-data with:
 * - image: File (optional)
 * - name: string (required – user’s title for the prompt card)
 * - notes: string (optional – free text user notes)
 *
 * Returns a Prompt object with `promptText` filled in.
 * (If OPENAI_API_KEY is set, you can wire your OpenAI call here later.)
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const name = (form.get("name") || "Untitled").toString().trim();
    const notes = (form.get("notes") || "").toString();
    const file = form.get("image") as File | null;

    // Default image (if user didn’t upload)
    let imageUrl = "/placeholder.png";

    // If an image was provided, convert to a data URL so Next/Image can render it
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      imageUrl = `data:${file.type};base64,${base64}`;
    }

    // ---- PLACEHOLDER “generation”. ----
    // You can replace this with a real OpenAI vision call later.
    // Keep the key name as `promptText` to match our shared type.
    const promptText =
      notes?.length > 0
        ? `Generate design copy inspired by the provided image. Notes: ${notes}`
        : `Generate design copy inspired by the provided image titled "${name}".`;

    const saved: Prompt = {
      id: crypto.randomUUID(),
      title: name,
      author: "You",
      description: "Generated from your image.",
      imageUrl,
      favorite: false,
      createdAt: new Date().toISOString(),
      promptText, // ✅ matches app/types.ts
    };

    return NextResponse.json(saved, { status: 200 });
  } catch (err) {
    console.error("generate-prompt error:", err);
    return NextResponse.json(
      { error: "Failed to generate prompt." },
      { status: 500 }
    );
  }
}
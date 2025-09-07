/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Helper: turn a FormData file into a base64 data URL we can send to OpenAI
async function fileToDataUrl(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.type || "image/jpeg").split("/")[1] || "jpeg";
  const mime = file.type || `image/${ext}`;
  const b64 = buf.toString("base64");
  return `data:${mime};base64,${b64}`;
}

export async function POST(req: NextRequest) {
  const startedAt = new Date().toISOString();

  try {
    // --- Basic env/inputs validation -------------------------------------------------
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[generate-prompt] Missing OPENAI_API_KEY");
      return NextResponse.json(
        { ok: false, error: "Server not configured (missing OPENAI_API_KEY)" },
        { status: 500 }
      );
    }

    const form = await req.formData().catch((e) => {
      console.error("[generate-prompt] Failed to parse formData()", e);
      return null;
    });
    if (!form) {
      return NextResponse.json(
        { ok: false, error: "Invalid multipart request body" },
        { status: 400 }
      );
    }

    const image = form.get("image");
    const name = (form.get("name") as string | null) ?? undefined;
    const notes = (form.get("notes") as string | null) ?? undefined;

    if (!(image instanceof File) || !image.size) {
      console.error("[generate-prompt] No image provided in form-data 'image'");
      return NextResponse.json(
        { ok: false, error: "Please attach an image." },
        { status: 400 }
      );
    }

    const imageDataUrl = await fileToDataUrl(image);

    // --- OpenAI call -----------------------------------------------------------------
    const openai = new OpenAI({ apiKey });

    // You can change the model if you prefer
    const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

    const systemMsg =
      "You are a creative prompt engineer. Describe a concise, high-quality prompt that a designer could reuse. Focus on style, subject, composition, mood, palette, and key visual details. Keep it under 70 words.";

    const userLeadIn =
      notes && notes.trim().length
        ? `User notes to consider: ${notes.trim()}`
        : "Analyze the image and produce a reusable prompt.";

    const resp = await openai.responses.create({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "text", text: systemMsg }],
        },
        {
          role: "user",
          content: [
            { type: "text", text: userLeadIn },
            { type: "input_image", image_url: imageDataUrl },
          ],
        },
      ],
    });

    // The SDK v4 returns a structured object. Safely extract the final text:
    const text =
      resp.output_text ??
      (resp.output &&
        Array.isArray(resp.output) &&
        resp.output
          .map((p: any) =>
            p?.content
              ? p.content
                  .map((c: any) => (c?.text ? c.text : ""))
                  .join("")
              : ""
          )
          .join("")) ??
      "";

    if (!text || !text.trim()) {
      console.error("[generate-prompt] OpenAI returned empty text", {
        startedAt,
        model,
        responseId: (resp as any)?.id,
      });
      return NextResponse.json(
        {
          ok: false,
          error: "OpenAI did not return text. Check server logs for details.",
        },
        { status: 502 }
      );
    }

    // Build the object your UI expects to store in “Prompt Library”
    const prompt = {
      id: crypto.randomUUID(),
      title: name || "Generated prompt",
      author: "You",
      description: "Generated from your image.",
      imageUrl: imageDataUrl, // thumbnail preview; swap to persisted URL if you later upload to storage
      promptText: text.trim(),
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    // If you later wire Supabase, you can insert() here. For now just return JSON:
    console.info("[generate-prompt] Success", {
      startedAt,
      model,
      chars: prompt.promptText.length,
    });

    return NextResponse.json({ ok: true, prompt }, { status: 200 });
  } catch (err: any) {
    // ---- MAX VERBOSITY LOGGING (shows up in Vercel function logs) ------------------
    const status =
      err?.status ||
      err?.response?.status ||
      err?.error?.status ||
      500;

    // Try to extract any server payload from OpenAI error
    let serverPayload: any = undefined;
    try {
      serverPayload =
        err?.response?.data ||
        (typeof err?.response?.text === "function"
          ? await err.response.text()
          : undefined) ||
        err?.error ||
        err?.message;
    } catch {
      /* ignore */
    }

    console.error("[generate-prompt] FAILED", {
      status,
      name: err?.name,
      message: err?.message,
      code: err?.code,
      type: err?.type,
      startedAt,
      raw: serverPayload ?? err,
      stack: err?.stack,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          typeof serverPayload === "string"
            ? serverPayload
            : err?.message || "Failed to generate prompt.",
      },
      { status }
    );
  }
}

export const runtime = "edge"; // remove if you prefer node runtime
export const maxDuration = 30;
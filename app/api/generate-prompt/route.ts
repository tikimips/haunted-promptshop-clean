/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Convert a FormData File to a base64 data URL
async function fileToDataUrl(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";
  const b64 = buf.toString("base64");
  return `data:${mime};base64,${b64}`;
}

export const runtime = "edge"; // remove if you prefer Node runtime
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const startedAt = new Date().toISOString();

  try {
    // --- env / input checks ---------------------------------------------------------
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[generate-prompt] Missing OPENAI_API_KEY");
      return NextResponse.json(
        { ok: false, error: "Server missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const form = await req.formData().catch((e) => {
      console.error("[generate-prompt] formData() failed", e);
      return null;
    });
    if (!form) {
      return NextResponse.json(
        { ok: false, error: "Invalid multipart/form-data payload" },
        { status: 400 }
      );
    }

    const image = form.get("image");
    const name = (form.get("name") as string | null) ?? undefined;
    const notes = (form.get("notes") as string | null) ?? undefined;

    if (!(image instanceof File) || !image.size) {
      console.error("[generate-prompt] No image in field 'image'");
      return NextResponse.json(
        { ok: false, error: "Please attach an image file." },
        { status: 400 }
      );
    }

    const imageDataUrl = await fileToDataUrl(image);

    // --- OpenAI call via chat.completions (vision) ----------------------------------
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

    const systemMsg =
      "You are a creative prompt engineer. Return a concise, high-quality reusable prompt under 70 words. Include subject, style, mood, palette, composition and key visual details.";

    const userLeadIn =
      notes && notes.trim().length
        ? `User notes to consider: ${notes.trim()}`
        : "Analyze the image and produce a reusable prompt.";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemMsg },
        {
          role: "user",
          content: [
            { type: "text", text: userLeadIn },
            // Vision input
            { type: "image_url", image_url: { url: imageDataUrl } as any },
          ] as any,
        },
      ],
      temperature: 0.7,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ??
      completion.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
      "";

    if (!text) {
      console.error("[generate-prompt] Empty completion text", {
        startedAt,
        model,
        id: completion?.id,
      });
      return NextResponse.json(
        { ok: false, error: "OpenAI returned no text." },
        { status: 502 }
      );
    }

    // Build prompt object expected by UI
    const prompt = {
      id: crypto.randomUUID(),
      title: name || "Generated prompt",
      author: "You",
      description: "Generated from your image.",
      imageUrl: imageDataUrl,
      promptText: text,
      favorite: false,
      createdAt: new Date().toISOString(),
    };

    console.info("[generate-prompt] Success", {
      startedAt,
      model,
      chars: prompt.promptText.length,
    });

    return NextResponse.json({ ok: true, prompt }, { status: 200 });
  } catch (err: any) {
    const status =
      err?.status ||
      err?.response?.status ||
      err?.error?.status ||
      500;

    let payload: any = undefined;
    try {
      payload =
        err?.response?.data ||
        (typeof err?.response?.text === "function"
          ? await err.response.text()
          : undefined) ||
        err?.error ||
        err?.message;
    } catch {
      /* noop */
    }

    console.error("[generate-prompt] FAILED", {
      status,
      name: err?.name,
      message: err?.message,
      code: err?.code,
      type: err?.type,
      startedAt,
      raw: payload ?? err,
      stack: err?.stack,
    });

    return NextResponse.json(
      {
        ok: false,
        error:
          typeof payload === "string" ? payload : err?.message || "Failed to generate prompt.",
      },
      { status }
    );
  }
}
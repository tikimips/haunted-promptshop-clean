// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

type Body = {
  name: string;
  imageBase64: string; // "data:image/jpeg;base64,...."
};

export async function POST(req: Request) {
  try {
    const { name, imageBase64 } = (await req.json()) as Body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY env var.' },
        { status: 500 }
      );
    }
    if (!name || !imageBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: name, imageBase64.' },
        { status: 400 }
      );
    }

    const system = `You are a prompt author. Given an image, write one copy-ready creative prompt to guide a generative model.
Be specific (style, medium, mood, composition, color, lighting, details). 1–3 sentences.`;

    const user = [
      { type: 'text', text: 'Analyze this reference and output one reusable creative prompt.' },
      { type: 'image_url', image_url: { url: imageBase64 } },
    ];

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user as any },
        ],
        temperature: 0.8,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: 'OpenAI error', details: t }, { status: 500 });
    }

    const data = await resp.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim?.() ||
      'A polished prompt could not be generated. Try another image.';

    return NextResponse.json({ name, prompt: text });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
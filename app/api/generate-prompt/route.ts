import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { imageUrl, options } = body || {};
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });

  // Pass-through to Supabase Edge Function (replace URL)
  const fnUrl = process.env.SUPABASE_FUNCTION_URL || '';
  const r = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}` },
    body: JSON.stringify({ imageUrl, options })
  });
  const data = await r.json();
  return NextResponse.json(data);
}

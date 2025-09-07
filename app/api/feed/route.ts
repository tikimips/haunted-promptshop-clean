// app/api/feed/route.ts
import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = 15;

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const idx = (page - 1) * perPage + i + 1;
    const width = 1200;
    const height = 900;
    return {
      id: `${idx}`,
      title: `Inspo #${idx}`,
      author: "Picsum",
      description: "Placeholder inspiration image.",
      imageUrl: `https://picsum.photos/id/${(idx % 1000) + 1}/${width}/${height}`,
      promptText:
        "High-quality visual concept. Analyze composition, color harmony, style, and mood. Create a reusable text prompt capturing subject, lighting, lens, palette, and atmosphere.",
      favorite: false,
      createdAt: new Date().toISOString(),
    };
  });

  return NextResponse.json({ items });
}
// app/api/feed/route.ts
import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

/**
 * Simple, keyless feed using picsum.photos
 * /api/feed?page=1  -> returns 15 items per page
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const perPage = 15;

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const idNum = (page - 1) * perPage + i + 1;
    const id = `${idNum}`;
    const width = 1200;
    const height = 800;
    const imageUrl = `https://picsum.photos/id/${(idNum % 1000) + 1}/${width}/${height}`;

    return {
      id,
      title: `Inspiration ${id}`,
      author: "Unsplash",
      description: "Random visual inspiration.",
      imageUrl,
      prompt: `Describe the style and structure of image #${id} as a creative prompt.`,
      favorite: false,
      createdAt: new Date().toISOString(),
    };
  });

  // after 6 pages, stop producing new results to demonstrate "End"
  if (page > 6) return NextResponse.json({ items: [] });

  return NextResponse.json({ items });
}
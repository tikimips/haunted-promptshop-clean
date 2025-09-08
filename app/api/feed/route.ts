// app/api/feed/route.ts
import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = 12;

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const n = (page - 1) * perPage + (i + 1);
    return {
      id: `demo-${n}`,
      title: ["Isometric dashboard", "Flat icon set", "Minimal landing hero"][n % 3],
      author: ["Design Studio", "Icon Pack Co", "Creative Agency"][n % 3],
      description:
        ["Generate UI copy for a sleek isometric dashboard.",
         "Create 24 flat icons for a productivity app.",
         "Bold headline and CTA for a minimalist hero."][n % 3],
      imageUrl: `https://picsum.photos/seed/prompt-${n}/800/600`,
      promptText: `Write a prompt ${n} that describes ${["an isometric dashboard","a flat icon set","a minimal landing hero"][n%3]}.`,
      favorite: false,
      createdAt: new Date(Date.now() - n * 6e5).toISOString(),
    };
  });

  return NextResponse.json({ items });
}
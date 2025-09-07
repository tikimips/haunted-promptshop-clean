import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = 15;

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const idNum = (page - 1) * perPage + i + 1;
    return {
      id: `${idNum}`,
      title: `Inspo #${idNum}`,
      author: "Curator",
      description: "Sample inspiration card with a nice visual.",
      imageUrl: `https://picsum.photos/seed/${idNum}/1200/800`,
      promptText:
        "ultra-detailed cinematic photo, shallow depth of field, soft rim light, high contrast, 35mm, masterpiece",
      favorite: false,
      createdAt: new Date(Date.now() - idNum * 60_000).toISOString(),
    };
  });

  // Simulate end at page 6
  if (page > 6) return NextResponse.json([], { status: 200 });
  return NextResponse.json(items, { status: 200 });
}
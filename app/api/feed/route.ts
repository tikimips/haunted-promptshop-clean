// app/api/feed/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = 15;

  const hosts = [
    "https://images.unsplash.com",
    "https://picsum.photos",
    "https://cdn.dribbble.com",
    "https://mir-s3-cdn-cf.behance.net",
  ];

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const idNum = (page - 1) * perPage + i + 1;
    const host = hosts[idNum % hosts.length];
    const imageUrl =
      host.includes("unsplash")
        ? `${host}/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60`
        : host.includes("picsum")
        ? `${host}/seed/api-feed-${idNum}/1200/800`
        : host.includes("dribbble")
        ? `${host}/userupload/14109347/file/original-1bce50b6c8c6d5b6c8a8a.png`
        : `${host}/projects/404/4f2e4b404404/cover/1400x1050/abcdef.png`;

    return {
      id: `api-feed-${idNum}`,
      title: `Inspiration #${idNum}`,
      author: "Curated",
      description: "Found visual inspiration.",
      imageUrl,
      promptText:
        "Describe the style, composition, palette, and subject; then generate a concise, reusable concept prompt.",
      favorite: false,
      createdAt: new Date().toISOString(),
    };
  });

  return NextResponse.json({ page, perPage, items });
}
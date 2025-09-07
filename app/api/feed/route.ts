import { NextResponse } from "next/server";
import type { Prompt } from "@/app/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = 15;

  const items: Prompt[] = Array.from({ length: perPage }).map((_, i) => {
    const idNum = (page - 1) * perPage + i + 1;
    const id = `${idNum}`;
    const width = 1200, height = 900;
    const imageUrl = `https://picsum.photos/id/${(idNum % 1000) + 1}/${width}/${height}`;
    return {
      id,
      title: `Inspo #${id}`,
      author: "Collected",
      description: "Inspiration tile",
      imageUrl,
      promptText: "", // optional
      favorite: false,
      createdAt: new Date().toISOString(),
    };
  });

  return NextResponse.json(items);
}
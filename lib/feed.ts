import type { Prompt } from "@/app/types";

const DRIBBBLE = "https://cdn.dribbble.com";
const BEHANCE  = "https://mir-s3-cdn-cf.behance.net";
const UNSPLASH = "https://images.unsplash.com";
const PICSUM   = "https://picsum.photos";

const pool = [
  `${DRIBBBLE}/userupload/14109347/file/original-1bce50b6c8c6d5b6c8a8a.png`,
  `${DRIBBBLE}/userupload/14099417/file/original-5130ed4c5a80f6dd5f13.png`,
  `${BEHANCE}/projects/404/4f2e4b404404/cover/1400x1050/abcdef.png`,
  `${UNSPLASH}/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60`,
  `${PICSUM}/seed/haunted-1/1200/800`,
  `${PICSUM}/seed/haunted-2/1200/800`,
  `${UNSPLASH}/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=1200&q=60`,
];

function make(id: string, imageUrl: string): Prompt {
  return {
    id,
    title: "Inspiration",
    author: "Curated",
    description: "Found visual inspiration.",
    imageUrl,
    promptText: "Describe this style and generate a reusable concept prompt.",
    favorite: false,
    createdAt: new Date().toISOString(),
  };
}

// Fake paginated feed (replace with real APIs later).
export async function loadFeedPage(page: number): Promise<Prompt[]> {
  // 12 items per page from the pool (cycled)
  const out: Prompt[] = [];
  for (let i = 0; i < 12; i++) {
    const idx = (page * 12 + i) % pool.length;
    out.push(make(`feed-${page}-${i}`, pool[idx]));
  }
  return out;
}
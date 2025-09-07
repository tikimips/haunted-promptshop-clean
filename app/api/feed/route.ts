// app/api/feed/route.ts
import { NextResponse } from 'next/server';

// simple, keyless demo feed from Unsplash source URLs (enough for MVP)
const UNSPLASH = [
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d',
  'https://images.unsplash.com/photo-1558981285-6f0c94958bb6',
  'https://images.unsplash.com/photo-1495567720989-cebdbdd97913',
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'https://images.unsplash.com/photo-1495567720989-cebdbdd97913',
  'https://images.unsplash.com/photo-1549880338-65ddcdfd017b',
  'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0',
];

export type FeedItem = {
  id: string;
  title?: string;
  author?: string;
  source: string;    // 'unsplash' (for now)
  imageUrl: string;
  prompt?: string;
};

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = 12;

  // fake infinite paging by cycling through UNSPLASH with offsets
  const items: FeedItem[] = Array.from({ length: pageSize }).map((_, i) => {
    const idx = (i + (page - 1) * pageSize) % UNSPLASH.length;
    const url = `${UNSPLASH[idx]}?auto=format&fit=crop&w=1600&q=80`;
    return {
      id: `unsplash-${page}-${i}-${idx}`,
      title: ['Isometric UI', 'Brutalist Poster', 'Neon City', 'Surreal Portrait'][idx % 4],
      author: ['Top Designer', 'A. N. Other', 'Creative Studio'][idx % 3],
      source: 'unsplash',
      imageUrl: url,
      prompt: undefined,
    };
  });

  // pretend we have a lot of pages
  const hasMore = page < 50;

  return NextResponse.json({ page, pageSize, items, hasMore });
}
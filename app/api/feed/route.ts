// app/api/feed/route.ts
import { NextResponse } from 'next/server';

// Unified item shape for the feed
export type FeedItem = {
  id: string;
  title: string;
  imageUrl: string;
  source: 'dribbble' | 'behance' | 'static';
  url: string;
  author?: string;
};

const PAGE_SIZE = 21;

// ---------- Providers (optional keys) ----------

async function fetchDribbble(page: number): Promise<FeedItem[]> {
  const token = process.env.DRIBBBLE_TOKEN;
  if (!token) return [];
  const res = await fetch(
    `https://api.dribbble.com/v2/shots?page=${page}&per_page=${PAGE_SIZE}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data || [])
    .filter((s: any) => s.images?.hidpi || s.images?.two_x || s.images?.normal)
    .map((s: any) => ({
      id: String(s.id),
      title: s.title || 'Untitled',
      imageUrl: s.images.hidpi || s.images.two_x || s.images.normal,
      source: 'dribbble' as const,
      url: s.html_url,
      author: s.user?.name,
    }));
}

// Behance official API requires an Adobe key; we keep a no-op adapter unless provided.
async function fetchBehance(page: number): Promise<FeedItem[]> {
  const key = process.env.BEHANCE_KEY;
  if (!key) return [];
  const offset = (page - 1) * PAGE_SIZE;
  const res = await fetch(
    `https://api.behance.net/v2/projects?client_id=${key}&field=interaction,web,illustration,typography,art&sort=featured_date&time=all&per_page=${PAGE_SIZE}&page=${page}`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.projects || []).map((p: any) => ({
    id: String(p.id),
    title: p.name || 'Untitled',
    imageUrl: p.covers?.original || p.covers?.max_808 || p.covers?.max_808_url || p.covers?.max_808px || '',
    source: 'behance' as const,
    url: p.url,
    author: p.owners?.[0]?.display_name,
  })).filter((x: FeedItem) => !!x.imageUrl);
}

// ---------- Static fallback so there’s ALWAYS a feed ----------
const STATIC_IMAGES: FeedItem[] = Array.from({ length: 200 }).map((_, i) => ({
  id: `static-${i + 1}`,
  title: `Inspiration ${i + 1}`,
  imageUrl: `https://images.unsplash.com/photo-15${(40 + (i % 60))
    .toString()
    .padStart(2, '0')}25162-d76694265947?q=80&w=1200&auto=format&fit=crop`,
  source: 'static',
  url: 'https://unsplash.com',
  author: 'Unsplash',
}));

function pageSlice<T>(arr: T[], page: number, size: number) {
  const start = (page - 1) * size;
  return arr.slice(start, start + size);
}

// ---------- GET /api/feed?page=1 ----------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || 1));

  // Pull from providers (if keys present), else static
  const [dribbble, behance] = await Promise.all([
    fetchDribbble(page),
    fetchBehance(page),
  ]);

  let items: FeedItem[] = [...dribbble, ...behance];

  if (items.length === 0) {
    items = pageSlice(STATIC_IMAGES, page, PAGE_SIZE);
  }

  return NextResponse.json({
    page,
    pageSize: PAGE_SIZE,
    items,
    hasMore: items.length === PAGE_SIZE, // best-effort
  });
}

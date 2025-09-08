import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use Unsplash for high-quality design images
    const designKeywords = ['ui-design', 'graphic-design', 'logo', 'branding', 'illustration', 'web-design'];
    
    const designContent = Array.from({ length: 12 }, (_, i) => {
      const keyword = designKeywords[i % designKeywords.length];
      return {
        id: `design_shot_${Date.now()}_${i}`,
        title: `Modern ${keyword.replace('-', ' ').toUpperCase()} Concept`,
        imageUrl: `https://source.unsplash.com/400x300/?${keyword}&sig=${Date.now() + i}`,
        author: `UI Designer ${Math.floor(Math.random() * 50) + 1}`,
        likes: Math.floor(Math.random() * 400) + 50,
        views: Math.floor(Math.random() * 2000) + 200,
        tags: [keyword.replace('-', ' '), 'Modern', 'Professional'],
        created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
    
    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
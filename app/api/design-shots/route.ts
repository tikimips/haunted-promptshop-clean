import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    if (!process.env.FREEPIK_API_KEY) {
      return NextResponse.json({ error: 'Freepik API key not configured' }, { status: 500 });
    }
    
    const searchTerms = [
      'logo design', 'vector illustration', 'icon set', 'business graphics',
      'web design', 'ui elements', 'brand identity', 'graphic design',
      'digital art', 'creative design', 'modern illustration', 'typography'
    ];
    
    const searchTerm = searchTerms[(page - 1) % searchTerms.length];
    
    const response = await fetch(`https://api.freepik.com/v1/resources`, {
      method: 'GET',
      headers: {
        'X-Freepik-API-Key': process.env.FREEPIK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locale: 'en-US',
        filters: {
          query: searchTerm,
          content_type: ['vector', 'photo'],
          order: 'latest'
        },
        page: page,
        limit: 12
      })
    });
    
    if (!response.ok) {
      throw new Error(`Freepik API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const designContent = data.data?.map((item: any, i: number) => ({
      id: `freepik_${item.id}`,
      title: item.title || `${searchTerm} Design`,
      description: item.description || `Professional ${searchTerm} from Freepik`,
      imageUrl: item.image?.source?.url || item.thumbnails?.medium?.url,
      author: item.author?.name || 'Freepik Contributor',
      likes: Math.floor(Math.random() * 500) + 100,
      downloads: Math.floor(Math.random() * 200) + 50,
      format: item.content_type === 'vector' ? 'SVG, AI, EPS' : 'High-res JPG',
      category: searchTerm,
      source: 'Freepik'
    })) || [];
    
    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Freepik API error:', error);
    
    // Fallback to working placeholders if Freepik fails
    const fallbackContent = Array.from({ length: 12 }, (_, i) => ({
      id: `fallback_${Date.now()}_${i}`,
      title: `Design Collection ${i + 1}`,
      description: 'Professional design assets and templates',
      imageUrl: `https://via.placeholder.com/600x400/6366f1/ffffff?text=Design+${i + 1}`,
      author: `Studio ${i + 1}`,
      likes: Math.floor(Math.random() * 400) + 100,
      downloads: Math.floor(Math.random() * 200) + 50,
      format: 'Vector, PNG',
      category: 'Design',
      source: 'Placeholder'
    }));
    
    return NextResponse.json(fallbackContent);
  }
}
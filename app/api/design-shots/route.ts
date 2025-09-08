import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  
  try {
    if (!process.env.FREEPIK_API_KEY) {
      console.log('No Freepik API key, using placeholders');
      return NextResponse.json(createPlaceholderContent(page));
    }

    // Try Freepik API
    const searchTerms = ['logo', 'icon', 'illustration', 'vector', 'design', 'graphic'];
    const term = searchTerms[(page - 1) % searchTerms.length];
    
    const response = await fetch(`https://api.freepik.com/v1/resources?query=${term}&limit=12&page=${page}`, {
      headers: {
        'X-Freepik-API-Key': process.env.FREEPIK_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const designContent = data.data.map((item: any, i: number) => ({
          id: `freepik_${item.id}`,
          title: item.title || `${term} Design`,
          description: item.description || `Professional ${term} from Freepik`,
          imageUrl: item.image?.source?.url || item.thumbnails?.medium?.url || item.preview?.url,
          author: item.author?.name || 'Freepik',
          likes: Math.floor(Math.random() * 500) + 100,
          downloads: Math.floor(Math.random() * 200) + 50,
          format: 'Professional',
          category: term,
          source: 'Freepik'
        }));
        
        return NextResponse.json(designContent);
      }
    }

    // Fallback if Freepik fails
    console.log('Freepik API failed, using placeholders');
    return NextResponse.json(createPlaceholderContent(page));
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(createPlaceholderContent(page));
  }
}

function createPlaceholderContent(page: number) {
  const designTypes = [
    { name: 'Logo Design', color: '6366f1' },
    { name: 'Icon Set', color: '8b5cf6' },
    { name: 'Illustration', color: '06b6d4' },
    { name: 'Typography', color: '10b981' },
    { name: 'Branding', color: 'f59e0b' },
    { name: 'Web Design', color: 'ef4444' }
  ];
  
  const designContent = Array.from({ length: 12 }, (_, i) => {
    const design = designTypes[i % designTypes.length];
    const uniqueId = page * 1000 + i;
    
    return {
      id: `design_${uniqueId}`,
      title: `${design.name} Collection`,
      description: `Professional ${design.name.toLowerCase()} assets and templates`,
      imageUrl: `https://via.placeholder.com/600x400/${design.color}/ffffff?text=${encodeURIComponent(design.name)}`,
      author: `Studio ${(uniqueId % 10) + 1}`,
      likes: Math.floor(Math.random() * 400) + 100,
      downloads: Math.floor(Math.random() * 200) + 50,
      format: 'Vector, PNG',
      category: design.name,
      source: 'Design Library'
    };
  });

  return designContent;
}
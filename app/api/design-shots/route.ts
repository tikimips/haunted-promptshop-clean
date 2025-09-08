import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.PIXABAY_API_KEY) {
      const categories = ['vector', 'illustration', 'graphics', 'logo', 'icon', '3d'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const response = await fetch(
        `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${category}&image_type=vector&category=graphics&per_page=12&safesearch=true`
      );
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data.hits.map((hit: any) => ({
          id: `pixabay_${hit.id}`,
          title: `${category} Design Collection`,
          description: `Professional ${category} design and graphics`,
          imageUrl: hit.webformatURL,
          author: hit.user,
          likes: hit.likes,
          downloads: hit.downloads,
          format: 'Vector, SVG',
          category: category
        })));
      }
    }
    
    return NextResponse.json([]);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([]);
  }
}
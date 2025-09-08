import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    // Search Wikimedia Commons for vector graphics and illustrations
    const categories = [
      'Vector_graphics', 'SVG_icons', 'Illustrations', 'Logo_designs', 
      'Technical_drawings', 'Geometric_patterns', 'Abstract_art'
    ];
    
    const category = categories[(page - 1) % categories.length];
    
    // Wikimedia Commons API call for category members
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:${category}&gcmlimit=12&gcmtype=file&prop=imageinfo&iiprop=url&format=json&origin=*`
    );
    
    if (response.ok) {
      const data = await response.json();
      const pages = data.query?.pages || {};
      
      const designContent = Object.values(pages).map((page: any, i) => ({
        id: `wikimedia_${page.pageid}`,
        title: page.title.replace('File:', '').split('.')[0],
        description: `Creative Commons ${category.replace('_', ' ').toLowerCase()} from Wikimedia Commons`,
        imageUrl: page.imageinfo?.[0]?.url || `https://via.placeholder.com/600x400/6366f1/ffffff?text=Vector+Art`,
        author: 'Wikimedia Contributor',
        likes: Math.floor(Math.random() * 400) + 100,
        downloads: Math.floor(Math.random() * 200) + 50,
        format: 'SVG, CC License',
        category: category.replace('_', ' '),
        source: 'Wikimedia Commons'
      }));
      
      return NextResponse.json(designContent);
    }
    
    return NextResponse.json([]);
  } catch (error) {
    console.error('Wikimedia Commons API error:', error);
    return NextResponse.json([]);
  }
}
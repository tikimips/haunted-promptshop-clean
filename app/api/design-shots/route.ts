import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const seed = page * 1337 + Date.now() % 10000;
    
    // Use working image URLs only
    const designContent = Array.from({ length: 12 }, (_, i) => {
      const itemSeed = seed + i * 47;
      const sourceType = itemSeed % 4;
      
      let imageUrl, title, description, source, format;
      
      switch (sourceType) {
        case 0: // Unsplash design photos (these work reliably)
          const designQueries = ['ui-design', 'graphic-design', 'branding', 'web-design', 'typography'];
          const query = designQueries[itemSeed % designQueries.length];
          imageUrl = `https://source.unsplash.com/600x400/?${query}&sig=${itemSeed}`;
          title = `${query.replace('-', ' ')} Inspiration`;
          description = `Professional design photography and workspace inspiration`;
          source = 'Unsplash';
          format = 'High-res JPG';
          break;
          
        case 1: // Placeholder graphics (guaranteed to work)
          const colors = ['6366f1', '8b5cf6', '06b6d4', '10b981', 'f59e0b', 'ef4444'];
          const categories = ['Logo Design', 'Icon Set', 'Illustration', 'Typography', 'Branding'];
          const category = categories[itemSeed % categories.length];
          const color = colors[itemSeed % colors.length];
          imageUrl = `https://via.placeholder.com/600x400/${color}/ffffff?text=${encodeURIComponent(category)}`;
          title = `${category} Collection`;
          description = `Professional ${category.toLowerCase()} assets and templates`;
          source = 'Vector Graphics';
          format = 'SVG, AI';
          break;
          
        case 2: // Lorem Picsum (random photos that work)
          const picId = 100 + (itemSeed % 900);
          imageUrl = `https://picsum.photos/600/400?random=${picId}`;
          title = `Creative Design ${i + 1}`;
          description = `Modern design inspiration and creative concepts`;
          source = 'Creative';
          format = 'High-res';
          break;
          
        case 3: // Unsplash specific IDs (known working images)
          const unsplashIds = [
            'photo-1558655146-d09347e92766', 'photo-1560472354-b33ff0c44a43', 
            'photo-1551650975-87deedd944c3', 'photo-1572044162444-ad60f128bdea',
            'photo-1467232004584-a241de8bcf5d', 'photo-1586717791821-3f44a563fa4c'
          ];
          const unsplashId = unsplashIds[itemSeed % unsplashIds.length];
          imageUrl = `https://images.unsplash.com/${unsplashId}?w=600&h=400&fit=crop&auto=format`;
          title = `Design Workspace ${i + 1}`;
          description = `Professional design environments and creative spaces`;
          source = 'Design Photography';
          format = 'Professional';
          break;
      }
      
      return {
        id: `design_${itemSeed}_${i}`,
        title: title,
        description: description,
        imageUrl: imageUrl,
        author: `Studio ${(itemSeed % 50) + 1}`,
        likes: Math.floor(itemSeed % 600) + 100,
        downloads: Math.floor(itemSeed % 300) + 50,
        format: format,
        category: title.split(' ')[0],
        source: source
      };
    });
    
    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
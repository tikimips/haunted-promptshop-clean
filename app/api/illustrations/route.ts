import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Focus on vector illustrations and graphics
    const illustrationContent = Array.from({ length: 12 }, (_, i) => {
      const illustrationTypes = [
        {
          style: 'Isometric 3D',
          description: 'Modern isometric illustrations for web and mobile',
          color: '667eea'
        },
        {
          style: 'Flat Vector',
          description: 'Minimalist flat design illustrations and graphics',
          color: 'f093fb'
        },
        {
          style: 'Character Design',
          description: 'Vector character illustrations and mascot designs',
          color: '4facfe'
        },
        {
          style: 'Abstract Graphics',
          description: 'Geometric and abstract vector compositions',
          color: '43e97b'
        },
        {
          style: 'Technical Diagrams',
          description: 'Infographic elements and technical illustrations',
          color: 'fa709a'
        },
        {
          style: 'Game Assets',
          description: 'Vector game elements, sprites, and UI components',
          color: 'feca57'
        }
      ];

      const type = illustrationTypes[i % illustrationTypes.length];
      
      return {
        id: `illustration_${Date.now()}_${i}`,
        title: `${type.style} Pack`,
        imageUrl: `https://via.placeholder.com/400x300/${type.color}/ffffff?text=${encodeURIComponent(type.style)}`,
        author: `Vector Artist ${Math.floor(Math.random() * 25) + 1}`,
        likes: Math.floor(Math.random() * 600) + 100,
        downloads: Math.floor(Math.random() * 300) + 50,
        tags: [type.style.split(' ')[0], 'Vector', 'Illustration'],
        created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: type.description,
        format: 'SVG, AI, PNG',
        style: type.style
      };
    });
    
    return NextResponse.json(illustrationContent);
  } catch (error) {
    console.error('Illustration API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
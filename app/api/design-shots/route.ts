import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const designSources = [
      // unDraw illustrations (high-quality, free)
      {
        category: 'Digital Illustration',
        imageUrl: 'https://undraw.co/api/illustrations/programming',
        description: 'Modern vector illustrations for digital projects',
        format: 'SVG, PNG'
      },
      {
        category: 'Business Graphics',
        imageUrl: 'https://undraw.co/api/illustrations/business_plan',
        description: 'Professional business and startup illustrations',
        format: 'SVG, PNG'
      },
      // Design-focused Unsplash content
      {
        category: 'UI Design Mockups',
        imageUrl: 'https://source.unsplash.com/600x400/?ui,mockup,interface',
        description: 'User interface design and app mockups',
        format: 'High-res JPG'
      },
      {
        category: 'Logo Design Work',
        imageUrl: 'https://source.unsplash.com/600x400/?logo,branding,design',
        description: 'Professional logo and brand identity work',
        format: 'High-res JPG'
      },
      {
        category: 'Web Design Layouts',
        imageUrl: 'https://source.unsplash.com/600x400/?website,layout,responsive',
        description: 'Modern web design and responsive layouts',
        format: 'High-res JPG'
      },
      // Placeholder graphics for vector categories
      {
        category: 'Icon Set Design',
        imageUrl: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Icon+Set+Collection',
        description: 'Scalable vector icon sets and symbol libraries',
        format: 'SVG, AI'
      },
      {
        category: '3D Design Assets',
        imageUrl: 'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=3D+Assets',
        description: 'Modern 3D graphics and dimensional design elements',
        format: '3D, OBJ'
      },
      {
        category: 'Game Design Assets',
        imageUrl: 'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Game+Assets',
        description: 'Gaming graphics, sprites, and UI components',
        format: 'PNG, SVG'
      },
      {
        category: 'Vector Patterns',
        imageUrl: 'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Vector+Patterns',
        description: 'Seamless patterns and geometric designs',
        format: 'SVG, AI'
      },
      {
        category: 'Typography Design',
        imageUrl: 'https://source.unsplash.com/600x400/?typography,font,lettering',
        description: 'Custom typography and lettering design work',
        format: 'Vector, OTF'
      },
      {
        category: 'Brand Identity',
        imageUrl: 'https://source.unsplash.com/600x400/?branding,identity,corporate',
        description: 'Complete brand identity systems and guidelines',
        format: 'Various'
      },
      {
        category: 'Print Design',
        imageUrl: 'https://source.unsplash.com/600x400/?poster,print,layout',
        description: 'Editorial layouts, posters, and print materials',
        format: 'Print-ready'
      }
    ];

    const content = designSources.map((source, i) => ({
      id: `design_${Date.now()}_${i}`,
      title: `${source.category} Collection`,
      description: source.description,
      imageUrl: `${source.imageUrl}&sig=${Date.now() + i}`,
      author: `Design Studio ${Math.floor(Math.random() * 40) + 1}`,
      likes: Math.floor(Math.random() * 700) + 150,
      downloads: Math.floor(Math.random() * 250) + 75,
      format: source.format,
      category: source.category,
      source: source.imageUrl.includes('undraw') ? 'unDraw' : 
              source.imageUrl.includes('unsplash') ? 'Curated' : 'Vector'
    }));

    return NextResponse.json(content);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
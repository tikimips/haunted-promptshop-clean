import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const designContent = Array.from({ length: 12 }, (_, i) => {
      const designTypes = [
        { category: 'Logo Design', description: 'Professional logo concepts and brand identity elements' },
        { category: 'UI/UX Design', description: 'Modern interface designs and user experience patterns' },
        { category: 'Illustration', description: 'Creative vector illustrations and digital artwork' },
        { category: 'Brand Identity', description: 'Complete branding systems and visual identity designs' },
        { category: 'Print Design', description: 'Editorial layouts, posters, and print media designs' },
        { category: 'Motion Graphics', description: 'Animation concepts and motion design inspiration' }
      ];

      const designType = designTypes[i % designTypes.length];
      
      const imageUrls = [
        `https://source.unsplash.com/600x400/?design,${designType.category.toLowerCase().replace(' ', '-')}&sig=${Date.now() + i}`,
        `https://picsum.photos/600/400?random=${Date.now() + i}`,
        `https://source.unsplash.com/600x400/?logo,branding,graphic-design&sig=${i}`
      ];

      return {
        id: `design_${Date.now()}_${i}`,
        title: `${designType.category} Inspiration`,
        imageUrl: imageUrls[i % imageUrls.length],
        author: `Design Studio ${Math.floor(Math.random() * 50) + 1}`,
        likes: Math.floor(Math.random() * 600) + 100,
        views: Math.floor(Math.random() * 3000) + 500,
        tags: [designType.category, 'Professional', 'Creative'],
        created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: designType.description
      };
    });
    
    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
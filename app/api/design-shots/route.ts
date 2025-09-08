import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create working placeholder content while we debug Freepik
    const designContent = Array.from({ length: 12 }, (_, i) => {
      const designTypes = [
        { name: 'Logo Design', color: '6366f1' },
        { name: 'Icon Set', color: '8b5cf6' },
        { name: 'Illustration', color: '06b6d4' },
        { name: 'Typography', color: '10b981' },
        { name: 'Branding', color: 'f59e0b' },
        { name: 'Web Design', color: 'ef4444' }
      ];
      
      const design = designTypes[i % designTypes.length];
      const uniqueId = Date.now() + i;
      
      return {
        id: `design_${uniqueId}`,
        title: `${design.name} Collection`,
        description: `Professional ${design.name.toLowerCase()} assets and templates`,
        imageUrl: `https://via.placeholder.com/600x400/${design.color}/ffffff?text=${encodeURIComponent(design.name)}`,
        author: `Studio ${(i % 10) + 1}`,
        likes: Math.floor(Math.random() * 400) + 100,
        downloads: Math.floor(Math.random() * 200) + 50,
        format: 'Vector, PNG',
        category: design.name,
        source: 'Design Library'
      };
    });

    return NextResponse.json(designContent);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([]);
  }
}
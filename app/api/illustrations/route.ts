import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Focus specifically on illustrations and vector graphics
    const illustrationContent = Array.from({ length: 12 }, (_, i) => {
      const illustrationStyles = [
        'Minimalist Vector Art',
        'Hand-drawn Illustration',
        'Geometric Design',
        'Character Design',
        'Icon Set Design',
        'Infographic Elements'
      ];

      const style = illustrationStyles[i % illustrationStyles.length];
      
      return {
        id: `illustration_${Date.now()}_${i}`,
        title: `${style} Collection`,
        imageUrl: `https://source.unsplash.com/600x400/?illustration,vector,graphic-design&sig=${Date.now() + i}`,
        author: `Illustrator ${Math.floor(Math.random() * 30) + 1}`,
        likes: Math.floor(Math.random() * 400) + 50,
        downloads: Math.floor(Math.random() * 150) + 25,
        tags: [style.split(' ')[0], 'Vector', 'Illustration'],
        created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        format: 'SVG, PNG, AI',
        license: 'Commercial Use'
      };
    });
    
    return NextResponse.json(illustrationContent);
  } catch (error) {
    console.error('Illustration API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
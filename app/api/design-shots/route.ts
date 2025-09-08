import { NextResponse } from 'next/server';

export async function GET() {
  const designs = [
    { type: 'Vector Logo', color: '6366f1' },
    { type: '3D Render', color: '8b5cf6' },
    { type: 'Game UI', color: '06b6d4' },
    { type: 'Icon Set', color: '10b981' },
    { type: 'Illustration', color: 'f59e0b' },
    { type: 'Brand Graphics', color: 'ef4444' }
  ];

  const content = Array.from({ length: 12 }, (_, i) => {
    const design = designs[i % designs.length];
    return {
      id: `design_${Date.now()}_${i}`,
      title: `${design.type} Collection`,
      imageUrl: `https://via.placeholder.com/400x300/${design.color}/ffffff?text=${design.type.replace(' ', '+')}`,
      author: `Design Studio ${Math.floor(Math.random() * 30) + 1}`,
      likes: Math.floor(Math.random() * 800) + 200,
      tags: [design.type, 'Vector', 'Professional'],
      description: `Professional ${design.type.toLowerCase()} designs and concepts`,
      format: 'SVG, AI, EPS'
    };
  });
  
  return NextResponse.json(content);
}
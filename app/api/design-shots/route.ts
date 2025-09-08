import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Combine multiple sources for illustrations and graphics
    const illustrationSources = [
      {
        source: 'undraw',
        baseUrl: 'https://undraw.co/api/illustrations',
        type: 'vector illustration'
      },
      {
        source: 'pixabay',
        baseUrl: 'https://pixabay.com/api/?key=YOUR_KEY&category=illustration&image_type=vector',
        type: 'vector graphics'
      },
      {
        source: 'placeholder',
        baseUrl: 'https://picsum.photos/400/300',
        type: 'design mockup'
      }
    ];

    // Generate mixed content focusing on actual design work
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
      
      // Use different image sources for variety
      const imageUrls = [
        `https://source.unsplash.com/600x400/?design,${designType.category.toLowerCase().replace(' ', '-')}&sig=${Date.now() + i}`,
        `https://picsum.photos/600/400?random=${Date.now() + i}`,
        `https://source.unsplash.com/600x400/?logo,branding,graphic-design&sig=${i}`
      ];

      return {
        id: `design_${Date.no
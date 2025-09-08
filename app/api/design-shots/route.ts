import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    // Generate unique seed based on page and timestamp
    const seed = page * 1000 + Date.now();
    
    const categories = [
      'Digital Illustration', 'Business Graphics', 'UI Design Mockups', 'Logo Design Work',
      'Web Design Layouts', 'Icon Set Design', 'Brand Identity', 'Typography Design',
      'Print Design', '3D Design Assets', 'Game Design Assets', 'Vector Patterns',
      'App Interface Design', 'Creative Direction', 'Visual Identity', 'Motion Graphics'
    ];

    const searchTerms = [
      'design', 'creative', 'graphic', 'digital', 'branding', 'minimal', 'modern', 'abstract',
      'colorful', 'geometric', 'artistic', 'professional', 'corporate', 'startup', 'tech', 'mobile'
    ];

    const designContent = Array.from({ length: 12 }, (_, i) => {
      // Create unique variations for each item
      const itemSeed = seed + i * 137; // Use prime number for better distribution
      const categoryIndex = itemSeed % categories.length;
      const searchTerm = searchTerms[itemSeed % searchTerms.length];
      const randomId = Math.floor(itemSeed % 9999) + 1000;
      
      return {
        id: `design_${page}_${itemSeed}_${i}`,
        title: `${categories[categoryIndex]} Pack`,
        description: `Professional ${categories[categoryIndex].toLowerCase()} featuring modern design principles and creative solutions`,
        imageUrl: `https://picsum.photos/600/400?random=${randomId}&t=${itemSeed}`,
        author: `Studio ${Math.floor(itemSeed % 50) + 1}`,
        likes: Math.floor((itemSeed % 800)) + 100,
        downloads: Math.floor((itemSeed % 300)) + 50,
        format: ['SVG, AI', 'High-res JPG', 'Vector, PNG', '3D, OBJ', 'PSD, SKETCH'][itemSeed % 5],
        category: categories[categoryIndex],
        source: 'Design'
      };
    });

    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
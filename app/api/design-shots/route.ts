import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * 12;

    // Different Unsplash image collections for variety
    const imageCollections = [
      // Page 1 - UI/Web Design
      [
        'photo-1558655146-d09347e92766', 'photo-1560472354-b33ff0c44a43', 'photo-1551650975-87deedd944c3',
        'photo-1572044162444-ad60f128bdea', 'photo-1467232004584-a241de8bcf5d', 'photo-1558655146-9f40138edfeb',
        'photo-1586717791821-3f44a563fa4c', 'photo-1506905925346-21bda4d32df4', 'photo-1507003211169-0a1dd7228f2d',
        'photo-1618005182384-a83a8bd57fbe', 'photo-1550745165-9bc0b252726f', 'photo-1541701494587-cb58502866ab'
      ],
      // Page 2 - Brand/Logo Design  
      [
        'photo-1611224923853-80b023f02d71', 'photo-1542744173-8e7e53415bb0', 'photo-1557804506-669a67965ba0',
        'photo-1542744094-3a31f272c490', 'photo-1517077304055-6e89abbf09b0', 'photo-1542744173-05336fcc7ad4',
        'photo-1557804506-669a67965ba0', 'photo-1542744094-24638eff58bb', 'photo-1542744095-fcf48d80b0fd',
        'photo-1542744173-b6894b9a5bd9', 'photo-1542744094-3a31f272c490', 'photo-1557804506-669a67965ba0'
      ],
      // Page 3 - Creative/Abstract
      [
        'photo-1561070791-36a0d2d5f8d6', 'photo-1571171637578-41bc2dd41cd2', 'photo-1558618666-fcd25c85cd64',
        'photo-1571171637578-41bc2dd41cd2', 'photo-1561070791-36a0d2d5f8d6', 'photo-1571171637578-41bc2dd41cd2',
        'photo-1558618666-fcd25c85cd64', 'photo-1571171637578-41bc2dd41cd2', 'photo-1561070791-36a0d2d5f8d6',
        'photo-1571171637578-41bc2dd41cd2', 'photo-1558618666-fcd25c85cd64', 'photo-1571171637578-41bc2dd41cd2'
      ],
      // Page 4+ - Mixed design content
      [
        'photo-1587440871875-191322ee64b0', 'photo-1581291518857-4e27b48ff24e', 'photo-1587440871875-191322ee64b0',
        'photo-1581291518857-4e27b48ff24e', 'photo-1587440871875-191322ee64b0', 'photo-1581291518857-4e27b48ff24e',
        'photo-1587440871875-191322ee64b0', 'photo-1581291518857-4e27b48ff24e', 'photo-1587440871875-191322ee64b0',
        'photo-1581291518857-4e27b48ff24e', 'photo-1587440871875-191322ee64b0', 'photo-1581291518857-4e27b48ff24e'
      ]
    ];

    const categories = [
      'Digital Illustration', 'Business Graphics', 'UI Design Mockups', 'Logo Design Work',
      'Web Design Layouts', 'Icon Set Design', 'Brand Identity', 'Typography Design',
      'Print Design', '3D Design Assets', 'Game Design Assets', 'Vector Patterns'
    ];

    const descriptions = [
      'Modern vector illustrations for digital projects',
      'Professional business and startup illustrations', 
      'User interface design and app mockups',
      'Professional logo and brand identity work',
      'Modern web design and responsive layouts',
      'Scalable vector icon sets and symbol libraries',
      'Complete brand identity systems and guidelines',
      'Custom typography and lettering design work',
      'Editorial layouts, posters, and print materials',
      'Modern 3D graphics and dimensional design elements',
      'Gaming graphics, sprites, and UI components',
      'Seamless patterns and geometric designs'
    ];

    // Select image collection based on page
    const collectionIndex = Math.min(page - 1, imageCollections.length - 1);
    const images = imageCollections[collectionIndex];

    const designContent = Array.from({ length: 12 }, (_, i) => {
      const globalIndex = offset + i;
      const categoryIndex = globalIndex % categories.length;
      const imageIndex = i % images.length;
      
      return {
        id: `design_${page}_${i}`,
        title: `${categories[categoryIndex]} Collection`,
        description: descriptions[categoryIndex],
        imageUrl: `https://images.unsplash.com/${images[imageIndex]}?w=600&h=400&fit=crop&auto=format`,
        author: `Design Studio ${Math.floor(Math.random() * 50) + 1}`,
        likes: Math.floor(Math.random() * 800) + 100,
        downloads: Math.floor(Math.random() * 300) + 50,
        format: ['SVG, AI', 'High-res JPG', 'Vector, PNG', '3D, OBJ'][Math.floor(Math.random() * 4)],
        category: categories[categoryIndex],
        source: 'Curated'
      };
    });

    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
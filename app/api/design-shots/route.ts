import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const designContent = [
      {
        id: 'digital_illustration_1',
        title: 'Digital Illustration Collection',
        description: 'Modern vector illustrations for digital projects',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 1',
        likes: 387,
        downloads: 156,
        format: 'SVG, PNG',
        category: 'Digital Illustration',
        source: 'Curated'
      },
      {
        id: 'business_graphics_2', 
        title: 'Business Graphics Collection',
        description: 'Professional business and startup illustrations',
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 2',
        likes: 542,
        downloads: 198,
        format: 'SVG, PNG',
        category: 'Business Graphics',
        source: 'Curated'
      },
      {
        id: 'ui_mockups_3',
        title: 'UI Design Mockups Collection', 
        description: 'User interface design and app mockups',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 3',
        likes: 623,
        downloads: 287,
        format: 'High-res JPG',
        category: 'UI Design Mockups',
        source: 'Curated'
      },
      {
        id: 'logo_design_4',
        title: 'Logo Design Work Collection',
        description: 'Professional logo and brand identity work', 
        imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 4',
        likes: 445,
        downloads: 167,
        format: 'Vector, AI',
        category: 'Logo Design',
        source: 'Curated'
      },
      {
        id: 'web_layouts_5',
        title: 'Web Design Layouts Collection',
        description: 'Modern web design and responsive layouts',
        imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 5', 
        likes: 356,
        downloads: 134,
        format: 'Responsive',
        category: 'Web Design',
        source: 'Curated'
      },
      {
        id: 'icon_sets_6',
        title: 'Icon Set Design Collection',
        description: 'Scalable vector icon sets and symbol libraries',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 6',
        likes: 678,
        downloads: 245,
        format: 'SVG, AI',
        category: 'Icon Set Design',
        source: 'Vector'
      },
      {
        id: 'brand_identity_7',
        title: 'Brand Identity Collection',
        description: 'Complete brand identity systems and guidelines',
        imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 7',
        likes: 523,
        downloads: 201,
        format: 'Various',
        category: 'Brand Identity', 
        source: 'Curated'
      },
      {
        id: 'typography_8',
        title: 'Typography Design Collection',
        description: 'Custom typography and lettering design work',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 8',
        likes: 412,
        downloads: 178,
        format: 'Vector, OTF',
        category: 'Typography',
        source: 'Curated'
      },
      {
        id: 'print_design_9',
        title: 'Print Design Collection',
        description: 'Editorial layouts, posters, and print materials',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 9',
        likes: 389,
        downloads: 156,
        format: 'Print-ready',
        category: 'Print Design',
        source: 'Curated'
      },
      {
        id: '3d_assets_10',
        title: '3D Design Assets Collection',
        description: 'Modern 3D graphics and dimensional design elements',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 10',
        likes: 567,
        downloads: 223,
        format: '3D, OBJ',
        category: '3D Design Assets',
        source: 'Vector'
      },
      {
        id: 'game_assets_11',
        title: 'Game Design Assets Collection',
        description: 'Gaming graphics, sprites, and UI components',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 11',
        likes: 634,
        downloads: 267,
        format: 'PNG, SVG',
        category: 'Game Design Assets',
        source: 'Vector'
      },
      {
        id: 'patterns_12',
        title: 'Vector Patterns Collection',
        description: 'Seamless patterns and geometric designs',
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop&auto=format',
        author: 'Design Studio 12',
        likes: 456,
        downloads: 189,
        format: 'SVG, AI',
        category: 'Vector Patterns',
        source: 'Vector'
      }
    ];

    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
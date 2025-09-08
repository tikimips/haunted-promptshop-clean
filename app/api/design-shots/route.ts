import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    // Generate a unique seed for this request
    const timestamp = Date.now();
    const seed = page * 1000 + (timestamp % 10000);
    
    // Large pool of different categories to rotate through
    const wikiCategories = [
      'Vector_graphics', 'SVG_icons', 'Illustrations', 'Logo_designs', 
      'Technical_drawings', 'Geometric_patterns', 'Abstract_art',
      'Diagrams', 'Maps', 'Symbols', 'Pictograms', 'Charts',
      'Architectural_drawings', 'Scientific_illustrations', 'Heraldry',
      'Graphic_design', 'Typography', 'Emblems', 'Flags', 'Coats_of_arms'
    ];
    
    // Mix real Wikimedia content with fallback designs
    const promises = [];
    
    // Try to get content from different categories
    for (let i = 0; i < 3; i++) {
      const categoryIndex = (seed + i * 7) % wikiCategories.length;
      const category = wikiCategories[categoryIndex];
      
      promises.push(
        fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:${category}&gcmlimit=4&gcmtype=file&prop=imageinfo&iiprop=url&format=json&origin=*`)
          .then(res => res.json())
          .catch(() => null)
      );
    }
    
    const results = await Promise.all(promises);
    let allContent = [];
    
    // Process Wikimedia results
    results.forEach((data, categoryIndex) => {
      if (data?.query?.pages) {
        const pages = Object.values(data.query.pages);
        pages.forEach((page: any, i) => {
          if (page.imageinfo?.[0]?.url) {
            allContent.push({
              id: `wiki_${seed}_${categoryIndex}_${i}`,
              title: page.title.replace('File:', '').split('.')[0].replace(/_/g, ' '),
              description: `Creative Commons vector graphic from Wikimedia Commons`,
              imageUrl: page.imageinfo[0].url,
              author: 'Wikimedia Contributor',
              likes: Math.floor((seed + i) % 400) + 100,
              downloads: Math.floor((seed + i) % 200) + 50,
              format: 'SVG, CC License',
              category: 'Vector Graphics',
              source: 'Wikimedia Commons'
            });
          }
        });
      }
    });
    
    // Fill remaining slots with varied fallback content
    const fallbackCategories = [
      'Logo Design', 'Icon Set', 'Illustration', '3D Graphics', 
      'Typography', 'Brand Identity', 'Print Design', 'Web Graphics'
    ];
    
    while (allContent.length < 12) {
      const fallbackIndex = (seed + allContent.length) % fallbackCategories.length;
      const category = fallbackCategories[fallbackIndex];
      const uniqueId = seed + allContent.length * 13;
      
      allContent.push({
        id: `fallback_${uniqueId}`,
        title: `${category} Collection`,
        description: `Professional ${category.toLowerCase()} assets and templates`,
        imageUrl: `https://picsum.photos/600/400?random=${uniqueId}`,
        author: `Studio ${(uniqueId % 50) + 1}`,
        likes: Math.floor(uniqueId % 600) + 150,
        downloads: Math.floor(uniqueId % 250) + 75,
        format: 'Vector, PNG',
        category: category,
        source: 'Curated'
      });
    }
    
    // Shuffle the final array for more variety
    allContent.sort(() => (seed % 3) - 1);
    
    return NextResponse.json(allContent.slice(0, 12));
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
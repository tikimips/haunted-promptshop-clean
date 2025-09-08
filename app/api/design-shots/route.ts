import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    const seed = page * 1337 + Date.now() % 10000;
    const designContent = [];
    
    // Try Wikimedia Commons first (without timeout)
    const wikiCategories = [
      'Vector_graphics', 'SVG_icons', 'Illustrations', 'Logo_designs', 
      'Diagrams', 'Maps', 'Symbols', 'Pictograms', 'Graphic_design'
    ];
    
    const categoryIndex = seed % wikiCategories.length;
    const category = wikiCategories[categoryIndex];
    
    try {
      const wikiResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:${category}&gcmlimit=3&gcmtype=file&prop=imageinfo&iiprop=url&format=json&origin=*`
      );
      
      if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json();
        const pages = wikiData.query?.pages || {};
        
        Object.values(pages).forEach((page: any, i) => {
          if (page.imageinfo?.[0]?.url && designContent.length < 3) {
            designContent.push({
              id: `wiki_${seed}_${i}`,
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
    } catch (error) {
      console.log('Wikimedia error, using fallbacks');
    }
    
    // Fill remaining slots with other sources
    const sources = [
      {
        type: 'manypixels',
        items: ['working-late', 'team-meeting', 'creative-process', 'startup-life', 'remote-work'],
        format: 'SVG, AI',
        source: 'ManyPixels'
      },
      {
        type: 'undraw',
        items: ['programming', 'design-process', 'business-plan', 'startup', 'team-collaboration'],
        format: 'SVG, PNG',
        source: 'unDraw'
      },
      {
        type: 'opendoodles',
        items: ['standing', 'sitting', 'messy', 'reading', 'selfie'],
        format: 'PNG, SVG',
        source: 'Open Doodles'
      },
      {
        type: 'unsplash',
        items: ['ui-design', 'graphic-design', 'branding', 'logo-design', 'web-design'],
        format: 'High-res JPG',
        source: 'Unsplash'
      }
    ];
    
    let sourceIndex = 0;
    while (designContent.length < 12) {
      const source = sources[sourceIndex % sources.length];
      const itemSeed = seed + designContent.length * 23;
      const item = source.items[itemSeed % source.items.length];
      
      let imageUrl, title, description;
      
      switch (source.type) {
        case 'manypixels':
          imageUrl = `https://www.manypixels.co/gallery/${item}`;
          title = `${item.replace('-', ' ')} Illustration`;
          description = `Professional vector illustration for business and tech projects`;
          break;
        case 'undraw':
          imageUrl = `https://undraw.co/api/illustrations/${item}`;
          title = `${item.replace('-', ' ')} Vector`;
          description = `Open-source illustration with customizable colors`;
          break;
        case 'opendoodles':
          imageUrl = `https://assets.website-files.com/5d5d5904f8a21bfe5ff69367/5da4ca62128e2b3a97582de5_${item}.png`;
          title = `${item} Character Design`;
          description = `Hand-drawn character illustrations and compositions`;
          break;
        case 'unsplash':
          imageUrl = `https://source.unsplash.com/600x400/?${item}&sig=${itemSeed}`;
          title = `${item.replace('-', ' ')} Inspiration`;
          description = `Professional design photography and workspace inspiration`;
          break;
      }
      
      designContent.push({
        id: `${source.type}_${itemSeed}`,
        title: title,
        description: description,
        imageUrl: imageUrl,
        author: `Studio ${(itemSeed % 50) + 1}`,
        likes: Math.floor(itemSeed % 600) + 100,
        downloads: Math.floor(itemSeed % 300) + 50,
        format: source.format,
        category: title.split(' ')[0],
        source: source.source
      });
      
      sourceIndex++;
    }
    
    return NextResponse.json(designContent);
  } catch (error) {
    console.error('Design API error:', error);
    return NextResponse.json([]);
  }
}
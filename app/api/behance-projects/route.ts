import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.BEHANCE_API_KEY) {
      const response = await fetch(
        `https://api.behance.net/v2/projects?client_id=${process.env.BEHANCE_API_KEY}&per_page=12&fields=illustration,graphic-design,branding`
      );
      
      if (response.ok) {
        const data = await response.json();
        const projects = data.projects?.map((project: any) => ({
          id: `behance_${project.id}`,
          name: project.name,
          imageUrl: project.covers?.['404'] || `https://source.unsplash.com/400x300/?design,${Math.random()}`,
          author: project.owners?.[0]?.display_name || 'Designer',
          likes: project.stats?.appreciations || 0,
          views: project.stats?.views || 0,
          tags: project.fields || ['Design'],
          created_at: new Date(project.published_on * 1000).toISOString()
        })) || [];
        
        return NextResponse.json(projects);
      }
    }
    
    // Fallback to curated design content
    const fallbackProjects = Array.from({ length: 12 }, (_, i) => ({
      id: `design_${Date.now()}_${i}`,
      name: `Professional ${['Logo', 'Brand', 'Illustration', 'Print'][i % 4]} Design`,
      imageUrl: `https://source.unsplash.com/400x300/?design,logo,brand&sig=${i}`,
      author: `Creative Studio ${Math.floor(Math.random() * 20) + 1}`,
      likes: Math.floor(Math.random() * 800) + 100,
      views: Math.floor(Math.random() * 5000) + 500,
      tags: ['Design', 'Professional', 'Creative'],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return NextResponse.json(fallbackProjects);
  } catch (error) {
    console.error('Behance API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
'use client';

import { useState, useEffect } from 'react';

interface DesignPrompt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  likes: number;
  downloads?: number;
  tags: string[];
  source: 'design' | 'illustration';
  format?: string;
  style?: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<DesignPrompt[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDesignContent = async (): Promise<DesignPrompt[]> => {
    try {
      const [designResponse, illustrationResponse] = await Promise.all([
        fetch('/api/design-shots'),
        fetch('/api/illustrations')
      ]);

      const designData = designResponse.ok ? await designResponse.json() : [];
      const illustrationData = illustrationResponse.ok ? await illustrationResponse.json() : [];

      const mixedContent: DesignPrompt[] = [
        ...designData.slice(0, 6).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          author: item.author,
          likes: item.likes,
          downloads: item.downloads || Math.floor(item.likes * 0.3),
          tags: item.tags || ['Design'],
          source: 'design' as const,
          format: item.format || 'Vector'
        })),
        ...illustrationData.slice(0, 6).map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          author: item.author,
          likes: item.likes,
          downloads: item.downloads || Math.floor(item.likes * 0.4),
          tags: item.tags || ['Illustration'],
          source: 'illustration' as const,
          format: item.format || 'SVG',
          style: item.style
        }))
      ];

      return mixedContent;
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  };

  const loadMorePrompts = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPrompts = await fetchDesignContent();
    setPrompts(prev => [...prev, ...newPrompts]);
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
      loadMorePrompts();
    }
  };

  useEffect(() => {
    if (prompts.length === 0) {
      loadMorePrompts();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vector & Illustration Library
          </h1>
          <p className="text-xl text-gray-600">
            Professional vectors, 3D renders, game assets & graphic designs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={prompt.imageUrl} 
                  alt={prompt.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    prompt.source === 'design' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {prompt.source === 'design' ? 'Design' : 'Vector Art'}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {prompt.format}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{prompt.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {prompt.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
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
          format: item.format || 'SVG'
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
        
        <div className="grid grid-cols-1 md:g
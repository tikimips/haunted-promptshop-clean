'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prompt } from '@/app/types';
import { generateMockPrompts } from '@/app/lib/mockData';
import { fetchBehanceProjects, fetchDribbbleShots } from '@/app/lib/designApis';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import PromptCard from '@/app/components/PromptCard';

const PROMPTS_PER_PAGE = 12;

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { isFetching, setIsFetching, setTargetRef } = useInfiniteScroll({
    threshold: 0.5,
    rootMargin: '100px'
  });

  const loadMorePrompts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Mix of design API content and mock prompts
      const [behanceData, dribbbleData] = await Promise.all([
        fetchBehanceProjects(6),
        fetchDribbbleShots(6)
      ]);
      
      // Convert design API data to Prompt format
      const designPrompts: Prompt[] = [
        ...behanceData.map((item, i) => ({
          id: `behance_${page}_${i}`,
          title: item.name || `Design Inspiration ${i + 1}`,
          description: `Professional design work showcasing modern creative techniques and innovative visual solutions.`,
          prompt: `Create a design inspired by this ${item.tags?.[0] || 'creative'} style, focusing on professional aesthetics and modern design principles.`,
          promptText: `Create a design inspired by this ${item.tags?.[0] || 'creative'} style, focusing on professional aesthetics and modern design principles.`,
          imageUrl: item.imageUrl,
          tags: item.tags || ['Design', 'Creative'],
          author: item.author || 'Designer',
          createdAt: item.created_at || new Date().toISOString(),
          likes: item.likes || 0,
          downloads: Math.floor((item.likes || 0) * 0.3),
          favorite: false
        })),
        ...dribbbleData.map((item, i) => ({
          id: `dribbble_${page}_${i}`,
          title: item.title || `UI Design ${i + 1}`,
          description: `Innovative UI/UX design showcasing contemporary interface design and user experience principles.`,
          prompt: `Design a modern interface inspired by this ${item.tags?.[0] || 'UI'} approach, emphasizing clean layouts and intuitive user interactions.`,
          promptText: `Design a modern interface inspired by this ${item.tags?.[0] || 'UI'} approach, emphasizing clean layouts and intuitive user interactions.`,
          imageUrl: item.imageUrl,
          tags: item.tags || ['UI', 'Interface'],
          author: item.author || 'UI Designer',
          createdAt: item.created_at || new Date().toISOString(),
          likes: item.likes || 0,
          downloads: Math.floor((item.likes || 0) * 0.4),
          favorite: false
        }))
      ];
      
      if (page >= 8) {
        setHasMore(false);
      }
      
      setPrompts(prev => [...prev, ...designPrompts]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading design content:', error);
      // Fallback to mock data
      const newPrompts = generateMockPrompts(PROMPTS_PER_PAGE, (page - 1) * PROMPTS_PER_PAGE + 1);
      setPrompts(prev => [...prev, ...newPrompts]);
      setPage(prev => prev + 1);
    }
    
    setLoading(false);
    setIsFetching(false);
  }, [page, loading, hasMore, setIsFetching]);

  useEffect(() => {
    if (prompts.length === 0) {
      loadMorePrompts();
    }
  }, []);

  useEffect(() => {
    if (isFetching && !loading) {
      loadMorePrompts();
    }
  }, [isFetching, loadMorePrompts, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Prompts
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect prompt for your next creative project
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading more prompts...</span>
          </div>
        )}
        {hasMore && !loading && (
          <div ref={setTargetRef} className="h-4 w-full" />
        )}
        {!hasMore && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've reached the end! 🎉</p>
          </div>
        )}
      </main>
    </div>
  );
}
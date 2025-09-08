'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prompt } from '@/app/types';
import { generateMockPrompts } from '@/app/lib/mockData';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import PromptCard from '@/app/components/PromptCard';

const PROMPTS_PER_PAGE = 12;

export default function Library() {
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPrompts = generateMockPrompts(PROMPTS_PER_PAGE, (page - 1) * PROMPTS_PER_PAGE + 1);
    
    if (page >= 8) {
      setHasMore(false);
    }
    
    setPrompts(prev => [...prev, ...newPrompts]);
    setPage(prev => prev + 1);
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
            Prompt Library
          </h1>
          <p className="text-xl text-gray-600">
            Browse your saved prompts and favorites
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
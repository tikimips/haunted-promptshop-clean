'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prompt } from '@/app/types';
import { generateMockPrompts } from '@/app/lib/mockData';
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPrompts = generateMockPrompts(PROMPTS_PER_PAGE, (page - 1) * PROMPTS_PER_PAGE + 1);
    
    if (page >= 8) { // Limit to reasonable amount for demo
      setHasMore(false);
    }
    
    setPrompts(prev => [...prev, ...newPrompts]);
    setPage(prev => prev + 1);
    setLoading(false);
    setIsFetching(false);
  }, [page, loading, hasMore, setIsFetching]);

  // Load initial prompts
  useEffect(() => {
    if (prompts.length === 0) {
      loadMorePrompts();
    }
  }, []);

  // Handle infinite scroll trigger
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

        <div className="grid grid-cols-
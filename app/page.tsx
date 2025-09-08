'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreContent = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/design-shots');
      const newData = await response.json();
      
      if (newData.length > 0) {
        setPrompts(prev => [...prev, ...newData]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
      loadMoreContent();
    }
  };

  useEffect(() => {
    loadMoreContent();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vector & Design Library
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
'use client';

import { useState, useEffect } from 'react';

interface MockPrompt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  likes: number;
  downloads: number;
}

export default function Home() {
  const [prompts, setPrompts] = useState<MockPrompt[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePrompts = (count: number, startId: number): MockPrompt[] => {
    const categories = ['UI/UX', 'Branding', 'Illustration', 'Photography', 'Marketing', 'Web Design'];
    const styles = ['Modern', 'Minimalist', 'Vintage', 'Bold', 'Elegant', 'Playful'];
    
    return Array.from({ length: count }, (_, i) => {
      const id = startId + i;
      return {
        id: id.toString(),
        title: `Creative ${styles[Math.floor(Math.random() * styles.length)]} ${categories[Math.floor(Math.random() * categories.length)]} Prompt`,
        description: `Generate amazing designs with this creative prompt featuring modern aesthetics and professional layouts.`,
        imageUrl: `https://images.unsplash.com/photo-${1558655146 + (id % 10)}?w=400&h=300&fit=crop&auto=format`,
        author: `Designer ${Math.floor(Math.random() * 100) + 1}`,
        likes: Math.floor(Math.random() * 500),
        downloads: Math.floor(Math.random() * 200)
      };
    });
  };

  const loadMorePrompts = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPrompts = generatePrompts(12, prompts.length + 1);
    setPrompts(prev => [...prev, ...newPrompts]);
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    loadMorePrompts();
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
            Discover Amazing Prompts
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect prompt for your next creative project
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={prompt.imageUrl} 
                alt={prompt.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{prompt.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">by {prompt.author}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>♥ {prompt.likes}</span>
                    <span>↓ {prompt.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading more prompts...</span>
          </div>
        )}
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateDesignContent = () => {
    const designs = [
      { type: 'Vector Logo Design', color: '6366f1', desc: 'Professional scalable logo concepts and brand marks' },
      { type: '3D Render Design', color: '8b5cf6', desc: 'Modern 3D illustrations and dimensional graphics' },
      { type: 'Game UI Design', color: '06b6d4', desc: 'Gaming interface designs and interactive elements' },
      { type: 'Icon Set Design', color: '10b981', desc: 'Scalable vector icon collections and symbol systems' },
      { type: 'Digital Illustration', color: 'f59e0b', desc: 'Creative vector illustrations and digital artwork' },
      { type: 'Brand Graphics', color: 'ef4444', desc: 'Complete visual identity and branding elements' },
      { type: 'Abstract Vector Art', color: '8b5cf6', desc: 'Geometric and abstract vector compositions' },
      { type: 'Character Design', color: '10b981', desc: 'Vector character illustrations and mascot designs' },
      { type: 'Infographic Elements', color: '06b6d4', desc: 'Data visualization and infographic components' },
      { type: 'Game Assets', color: 'f59e0b', desc: 'Vector game sprites, UI elements, and textures' },
      { type: 'Technical Diagrams', color: 'ef4444', desc: 'Engineering diagrams and technical illustrations' },
      { type: 'Motion Graphics', color: '6366f1', desc: 'Animation concepts and motion design elements' }
    ];

    return designs.map((design, i) => ({
      id: `design_${Date.now()}_${i}`,
      title: `${design.type} Pack`,
      description: design.desc,
      imageUrl: `https://via.placeholder.com/400x300/${design.color}/ffffff?text=${encodeURIComponent(design.type)}`,
      author: `Studio ${Math.floor(Math.random() * 50) + 1}`,
      likes: Math.floor(Math.random() * 800) + 100,
      downloads: Math.floor(Math.random() * 300) + 50,
      format: 'SVG, AI, EPS',
      category: design.type
    }));
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const content = generateDesignContent();
      setPrompts(content);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading design library...</p>
        </div>
      </div>
    );
  }

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
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Vector Art
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {prompt.format}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{prompt.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">by {prompt.author}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>♥ {prompt.likes}</span>
                    <span>↓ {prompt.downloads}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {prompt.category.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/design-shots')
      .then(res => res.json())
      .then(data => {
        setPrompts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
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
        
        {prompts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No design content available. Check API configuration.</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}
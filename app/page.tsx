'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Cap at 10 pages to control costs

  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/design-shots?page=${page}`);
      const data = await response.json();
      setPrompts(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vector & Design Library</h1>
          <p className="text-xl text-gray-600">Professional vectors, 3D renders, game assets & graphic designs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{prompt.description}</p>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">by {prompt.author}</span>
                  <span className="text-sm text-gray-500">♥ {prompt.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button 
            onClick={() => loadPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => loadPage(pageNum)}
                disabled={loading}
                className={`px-4 py-2 border rounded-lg ${
                  pageNum === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => loadPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </main>
    </div>
  );
}
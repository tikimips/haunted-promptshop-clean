'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadContent = async () => {
    setLoading(true);
    const response = await fetch('/api/design-shots');
    const data = await response.json();
    setPrompts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Design Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{prompt.title}</h3>
                <p className="text-gra
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetch('/api/design-shots')
      .then(res => res.json())
      .then(data => setPrompts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vector & Design Library
          </h1>
          <p className="text-xl text-gray-600">
            Professional vectors, 3D renders, game assets & graph
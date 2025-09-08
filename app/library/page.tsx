'use client';

export default function Library() {
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-2">Library Coming Soon</h3>
            <p className="text-gray-600 text-sm">Your saved prompts will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
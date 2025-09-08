'use client';

export default function Home() {
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
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={`https://picsum.photos/400/300?random=${i}`}
                alt={`Prompt ${i + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Creative Design Prompt {i + 1}</h3>
                <p className="text-gray-600 text-sm mb-3">Generate amazing designs with this prompt</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">by Designer {i + 1}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>♥ {Math.floor(Math.random() * 500)}</span>
                    <span>↓ {Math.floor(Math.random() * 200)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

interface UploadedImage {
  id: string;
  url: string;
  prompt: string;
  uploadedAt: string;
  isFavorite: boolean;
}

interface PendingUpload {
  file: File;
  url: string;
}

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('promptshop-images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Save images to localStorage whenever images change
  useEffect(() => {
    localStorage.setItem('promptshop-images', JSON.stringify(images));
  }, [images]);

  const handleFileSelected = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPendingUpload({ file, url: imageUrl });
  };

  const handleChooseAnother = () => {
    if (pendingUpload) {
      URL.revokeObjectURL(pendingUpload.url);
    }
    setPendingUpload(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleCancel = () => {
    if (pendingUpload) {
      URL.revokeObjectURL(pendingUpload.url);
    }
    setPendingUpload(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleGeneratePrompt = async () => {
    if (!pendingUpload) return;
    
    setIsGenerating(true);
    
    try {
      // Convert file to base64 for API
      const base64 = await fileToBase64(pendingUpload.file);
      
      // Analyze image with Claude
      const generatedPrompt = await analyzeImage(base64);
      
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        url: pendingUpload.url,
        prompt: generatedPrompt,
        uploadedAt: new Date().toISOString(),
        isFavorite: false
      };

      setImages(prev => [newImage, ...prev]);
      setPendingUpload(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
    
    setIsGenerating(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const analyzeImage = async (base64Image: string): Promise<string> => {
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      return data.prompt || 'Unable to generate prompt for this image';
    } catch (error) {
      console.error('Error analyzing image:', error);
      return 'Error analyzing image';
    }
  };

  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const filteredImages = filter === 'favorites' 
    ? images.filter(img => img.isFavorite)
    : images;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Promptshop</h1>
          <p className="text-xl text-gray-600">Your personal AI prompt and image library</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {!pendingUpload ? (
            <UploadComponent onFileSelected={handleFileSelected} />
          ) : (
            <ConfirmationComponent 
              imageUrl={pendingUpload.url}
              onChooseAnother={handleChooseAnother}
              onGeneratePrompt={handleGeneratePrompt}
              onCancel={handleCancel}
              isGenerating={isGenerating}
            />
          )}
        </div>

        {/* Filters */}
        {images.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({images.length})
              </button>
              <button
                onClick={() => setFilter('favorites')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'favorites' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Favorites ({images.filter(img => img.isFavorite).length})
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Sorted by most recent
            </div>
          </div>
        )}

        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.length === 0 && images.length === 0 && (
            <div className="col-span-full flex justify-center">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Your library will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Upload your first image to get started</p>
              </div>
            </div>
          )}

          {filteredImages.length === 0 && images.length > 0 && filter === 'favorites' && (
            <div className="col-span-full flex justify-center">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">No favorites yet</p>
                <p className="text-gray-400 text-sm mt-1">Heart images to add them to favorites</p>
              </div>
            </div>
          )}

          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>

              {hoveredImage === image.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => copyPrompt(image.prompt)}
                    className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Copy Prompt
                  </button>
                  <button
                    onClick={() => toggleFavorite(image.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      image.isFavorite
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {image.isFavorite ? '♥ Favorited' : '♡ Favorite'}
                  </button>
                </div>
              )}

              {image.isFavorite && (
                <div className="absolute top-2 right-2">
                  <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    ♥
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Upload Component
function UploadComponent({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-gray-600">
          <p className="text-lg font-medium">Drop an image here or click to upload</p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>
    </div>
  );
}

// Confirmation Component
function ConfirmationComponent({ 
  imageUrl, 
  onChooseAnother, 
  onGeneratePrompt, 
  onCancel, 
  isGenerating 
}: {
  imageUrl: string;
  onChooseAnother: () => void;
  onGeneratePrompt: () => void;
  onCancel: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="flex gap-6">
      <div className="w-48 h-48 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <p className="text-lg font-medium text-gray-900 mb-4">
          What would you like to do with this image?
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onChooseAnother}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose another photo
          </button>
          
          <button
            onClick={onGeneratePrompt}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating prompt...
              </>
            ) : (
              'Generate Prompt'
            )}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
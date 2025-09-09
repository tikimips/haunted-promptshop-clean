'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PromptData {
  id: string
  imageUrl: string
  promptText: string
  isFavorite: boolean
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Your existing Promptshop state
  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('')
  const [showUploadFlow, setShowUploadFlow] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/signin')
  }, [session, status, router])

  useEffect(() => {
    // Load prompts from localStorage on component mount
    const savedPrompts = localStorage.getItem('promptshop-prompts')
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts))
    }
  }, [])

  const savePromptsToStorage = (newPrompts: PromptData[]) => {
    localStorage.setItem('promptshop-prompts', JSON.stringify(newPrompts))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setShowUploadFlow(true)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setShowUploadFlow(true)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const analyzeImage = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setGeneratedPrompt(data.promptText || 'Failed to generate prompt')
    } catch (error) {
      console.error('Error analyzing image:', error)
      setGeneratedPrompt('Error analyzing image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const savePrompt = () => {
    if (!previewUrl || !generatedPrompt) return

    const newPrompt: PromptData = {
      id: Date.now().toString(),
      imageUrl: previewUrl,
      promptText: generatedPrompt,
      isFavorite: false,
    }

    const updatedPrompts = [newPrompt, ...prompts]
    setPrompts(updatedPrompts)
    savePromptsToStorage(updatedPrompts)

    // Reset the upload flow
    setSelectedFile(null)
    setPreviewUrl('')
    setGeneratedPrompt('')
    setShowUploadFlow(false)
  }

  const cancelUpload = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setGeneratedPrompt('')
    setShowUploadFlow(false)
  }

  const toggleFavorite = (id: string) => {
    const updatedPrompts = prompts.map(prompt =>
      prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
    )
    setPrompts(updatedPrompts)
    savePromptsToStorage(updatedPrompts)
  }

  const copyPrompt = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <h1 className="text-xl font-bold text-gray-900">Promptshop</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {showUploadFlow ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Generate Prompt</h2>
              
              {previewUrl && (
                <div className="mb-6">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-md mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {!generatedPrompt && !isUploading && (
                <div className="text-center mb-6">
                  <button
                    onClick={analyzeImage}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Generate Prompt
                  </button>
                </div>
              )}

              {isUploading && (
                <div className="text-center mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Analyzing image...</p>
                </div>
              )}

              {generatedPrompt && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Prompt:
                  </label>
                  <textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={cancelUpload}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                {generatedPrompt && (
                  <button
                    onClick={savePrompt}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Save to Library
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div className="max-w-2xl mx-auto mb-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload an image</h3>
                <p className="text-gray-600 mb-4">Drag and drop or click to select</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Prompt Library */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Prompt Library</h2>
              
              {prompts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-gray-600">No prompts saved yet. Upload an image to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {prompts.map((prompt) => (
                    <div key={prompt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                      <div className="relative">
                        <img
                          src={prompt.imageUrl}
                          alt="Prompt image"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyPrompt(prompt.promptText)}
                              className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => toggleFavorite(prompt.id)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                prompt.isFavorite
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-white text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {prompt.isFavorite ? '❤️' : '🤍'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {prompt.promptText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
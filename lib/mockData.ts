import { Prompt } from '@/app/types';

const categories = ['UI/UX', 'Branding', 'Illustration', 'Photography', 'Marketing', 'Web Design'];
const styles = ['Modern', 'Minimalist', 'Vintage', 'Bold', 'Elegant', 'Playful'];
const colors = ['Blue', 'Green', 'Purple', 'Orange', 'Red', 'Pink'];

export function generateMockPrompts(count: number = 20, startId: number = 1): Prompt[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const styleChoice = styles[Math.floor(Math.random() * styles.length)];
    const categoryChoice = categories[Math.floor(Math.random() * categories.length)];
    const colorChoice = colors[Math.floor(Math.random() * colors.length)];
    const promptText = `Create a ${styleChoice.toLowerCase()} ${categoryChoice.toLowerCase()} design featuring ${colorChoice.toLowerCase()} color scheme, professional typography, and contemporary layout principles.`;
    
    return {
      id: id.toString(),
      title: `Creative ${styleChoice} ${categoryChoice} Prompt`,
      description: `Generate a ${styleChoice.toLowerCase()} ${categoryChoice.toLowerCase()} design with ${colorChoice.toLowerCase()} accents. Focus on clean typography and modern layouts.`,
      prompt: promptText,
      promptText: promptText,
      imageUrl: `https://picsum.photos/400/300?random=${id}`,
      tags: [categoryChoice, styleChoice, colorChoice],
      author: `Designer ${Math.floor(Math.random() * 100) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 500),
      downloads: Math.floor(Math.random() * 200),
      favorite: false
    };
  });
}
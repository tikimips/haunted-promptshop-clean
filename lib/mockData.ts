import { Prompt } from '@/app/types';

const categories = ['UI/UX', 'Branding', 'Illustration', 'Photography', 'Marketing', 'Web Design'];
const styles = ['Modern', 'Minimalist', 'Vintage', 'Bold', 'Elegant', 'Playful'];
const colors = ['Blue', 'Green', 'Purple', 'Orange', 'Red', 'Pink'];

export function generateMockPrompts(count: number = 20, startId: number = 1): Prompt[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return {
      id: id.toString(),
      title: `Creative ${styles[Math.floor(Math.random() * styles.length)]} ${categories[Math.floor(Math.random() * categories.length)]} Prompt`,
      description: `Generate a ${styles[Math.floor(Math.random() * styles.length)].toLowerCase()} ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} design with ${colors[Math.floor(Math.random() * colors.length)].toLowerCase()} accents. Focus on clean typography and modern layouts.`,
      prompt: `Create a ${styles[Math.floor(Math.random() * styles.length)].toLowerCase()} ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} design featuring ${colors[Math.floor(Math.random() * colors.length)].toLowerCase()} color scheme, professional typography, and contemporary layout principles.`,
      imageUrl: `https://picsum.photos/400/300?random=${id}`,
      tags: [
        categories[Math.floor(Math.random() * categories.length)],
        styles[Math.floor(Math.random() * styles.length)],
        colors[Math.floor(Math.random() * colors.length)]
      ],
      author: `Designer ${Math.floor(Math.random() * 100) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 500),
      downloads: Math.floor(Math.random() * 200)
    };
  });
}
// app/types.ts
export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  prompt: string;
  favorite: boolean;
  createdAt: string; // ISO string
};
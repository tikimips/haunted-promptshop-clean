// app/types.ts
export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  promptText: string; // required everywhere
  favorite: boolean;
  createdAt: string;  // ISO string
};
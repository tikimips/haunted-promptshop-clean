// app/types.ts
export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  promptText: string; // required
  favorite: boolean;
  createdAt: string;  // ISO
};
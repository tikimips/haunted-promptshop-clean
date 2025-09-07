export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  promptText?: string;
  favorite: boolean;
  createdAt: string; // ISO
};
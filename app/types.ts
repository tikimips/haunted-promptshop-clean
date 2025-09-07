// app/types.ts
export type Prompt = {
  id: string;
  title: string;           // user-given name for the instance
  author: string;          // "You" or source
  description: string;     // the generated prompt text
  imageUrl: string | null; // data URL or remote URL
  favorite: boolean;
  createdAt: string;       // ISO string
};
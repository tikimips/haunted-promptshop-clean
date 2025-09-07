// app/types.ts
export interface Prompt {
  id: string | number;
  title: string;
  author: string;
  description: string;
  imageUrl?: string | null;
  owner?: string | null;
}

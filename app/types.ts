// app/types.ts
export type Prompt = {
  id: string;                 // string is safer for React keys
  title: string;
  author: string;
  description: string;
  imageUrl?: string | null;
};

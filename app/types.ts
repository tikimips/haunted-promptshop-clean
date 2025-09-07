// Central Prompt type used everywhere.
export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;       // can be https://… or data:…
  promptText: string;     // the actual prompt
  favorite: boolean;
  createdAt: string;      // ISO string
};
// app/types.ts

export type Prompt = {
  // Keep id flexible while you wire things up (Supabase UUIDs are strings).
  id: string | number;
  title: string;
  author?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

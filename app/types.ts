// app/types.ts
export type Prompt = {
  id: string;               // unique id (uuid-ish)
  title: string;            // user-supplied name
  author?: string | null;   // optional
  description?: string;     // the actual prompt text (what we copy)
  imageUrl?: string | null; // thumbnail
  createdAt: string;        // ISO date
  favorite?: boolean;       // ❤️
};

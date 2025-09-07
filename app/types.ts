/* Central app types */

export type Prompt = {
  id: string;                       // keep as string for easy keys/URLs
  title: string;
  author?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

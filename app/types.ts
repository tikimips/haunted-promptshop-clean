// app/types.ts

// The single source of truth for prompt items used by cards and grids.
export type Prompt = {
  id: string;                     // unique id for keys
  title: string;                  // e.g., "Isometric dashboard"
  author: string;                 // e.g., "Top Designer" or "Unsplash"
  description: string;            // short blurb
  imageUrl: string;               // absolute URL (Next/Image allows remote per next.config)
  favorite?: boolean;             // user can toggle
  createdAt: string;              // ISO string for sorting
  // Optional fields you might add later:
  promptText?: string;            // the generated text prompt (if applicable)
};
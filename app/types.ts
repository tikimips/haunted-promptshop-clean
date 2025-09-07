// app/types.ts

export type Prompt = {
  id: string;
  name: string;          // user-given name/title
  prompt: string;        // the generated prompt text
  imageUrl: string;      // thumbnail/source image
  favorite: boolean;
  createdAt: string;     // ISO string
};
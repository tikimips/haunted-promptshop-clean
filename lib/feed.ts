// lib/feed.ts
import type { Prompt } from "@/app/types";

// A simple seed feed so the Inspiration grid has content.
// You can swap these image URLs later for Behance/Dribbble, etc.
export const SEED_FEED: Prompt[] = [
  {
    id: "seed-1",
    title: "Isometric dashboard",
    author: "Top Designer",
    description:
      "Clean isometric admin dashboard card with soft shadows and subtle gradients.",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "An isometric UI dashboard with soft gradients, glassmorphism panels, and minimal iconography, crisp grid, subtle depth, high contrast typography, white background.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Playful 3D shapes",
    author: "CG Studio",
    description:
      "Candy-colored abstract 3D blobs and spheres with soft lighting.",
    imageUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "Abstract 3D composition of glossy spheres and blobs, pastel candy palette, soft area lighting, shallow depth of field, studio backdrop.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Editorial poster",
    author: "Type & Grid",
    description:
      "Bold editorial poster with oversized type and asymmetric layout.",
    imageUrl:
      "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "Modern editorial poster, oversized grotesk typography, asymmetric Swiss layout, high contrast black on white with one accent color, print texture.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "Moody product shot",
    author: "Photo Lab",
    description:
      "Dark product hero with rim light and dramatic reflections.",
    imageUrl:
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "Moody studio product photo, rim lighting, reflective surface, cinematic shadows, minimal background, premium aesthetic.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    title: "Neon cityscape",
    author: "Illustration",
    description:
      "Vibrant cyberpunk street scene with neon signs and rain.",
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "Cyberpunk alley at night, neon signage, wet asphalt reflections, light fog, bustling silhouettes, saturated magenta and teal.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    title: "Minimal portfolio",
    author: "Web UI",
    description:
      "Clean portfolio preview with generous whitespace and sharp type.",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    promptText:
      "Ultra minimal web UI landing, generous whitespace, precise baseline grid, monochrome palette with a single spectral accent.",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
];
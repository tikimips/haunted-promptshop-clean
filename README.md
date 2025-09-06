# Haunted / Promptshop.ai (MVP scaffold)

Minimal Next.js + Tailwind + Supabase wiring to kickstart Haunted.

## Quick start
1. `cp .env.example .env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `SUPABASE_FUNCTION_URL` (your deployed `generate-prompt` function URL)
2. `npm i`
3. `npm run dev`
4. Visit `/inspiration` and `/library`

## Notes
- Auth UI not included yet (use Supabase Auth helpers or your own).
- Replace sample images with real feed + uploads.

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import PromptCard from "@/components/PromptCard";

type DBPrompt = {
  id: string;
  title: string | null;
  prompt: string | null;
  owner: string | null;
  created_at: string | null;
  thumbnail_url?: string | null;
};

export default function PromptGrid({ mine = false }: { mine?: boolean }) {
  const [items, setItems] = useState<DBPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      // get current session (so we can filter by owner for "Library")
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user?.id ?? null;
      if (mounted) setUserId(uid);

      let query = supabase.from("prompts").select("*").order("created_at", { ascending: false }).limit(24);

      if (mine) {
        // If not signed in, nothing to show in Library
        if (!uid) {
          setItems([]);
          setLoading(false);
          return;
        }
        query = query.eq("owner", uid);
      }

      const { data, error } = await query;
      if (!mounted) return;

      if (error) {
        setError(error.message);
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    };

    load();

    // refresh after login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [mine]);

  if (loading) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }

  if (mine && !userId) {
    return <div className="text-sm text-neutral-500">Sign in to see your Library.</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Error: {error}</div>;
  }

  if (!items.length) {
    return (
      <div className="text-sm text-neutral-500">
        {mine ? "No saved prompts yet." : "No prompts yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((p) => (
        <PromptCard
          key={p.id}
          title={p.title ?? "Untitled prompt"}
          author={p.owner ? "You" : "Unknown"}
          description={(p.prompt ?? "").slice(0, 140)}
        />
      ))}
    </div>
  );
}

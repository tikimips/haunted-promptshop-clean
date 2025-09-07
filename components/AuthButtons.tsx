'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    const email = prompt('Enter your email to receive a sign-in link:');
    if (!email) return;

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // After the magic link, Supabase will return you here
          emailRedirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
      alert('Check your email for the magic link.');
    } catch (e: any) {
      alert(e.message || 'Error sending magic link');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
      // user will be redirected by Supabase
    } catch (e: any) {
      alert(e.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={signInWithEmail}
        disabled={loading}
        className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
      >
        {loading ? 'Working…' : 'Sign in with Email'}
      </button>

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
      >
        {loading ? 'Working…' : 'Continue with Google'}
      </button>
    </div>
  );
}

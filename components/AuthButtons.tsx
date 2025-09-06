'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthButtons() {
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      setUserEmail(session?.user?.email ?? null);
      if (session?.user) {
        // ensure profile row exists
        const id = session.user.id;
        await supabase.from('profiles').upsert({
          id,
          email: session.user.email ?? null
        });
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signInEmail() {
    const email = prompt('Enter your email to sign in');
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/inspiration`
      }
    });
    if (error) {
      alert(error.message);
    } else {
      setEmailSent(email);
    }
  }

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/inspiration`
      }
    });
    if (error) {
      alert(error.message);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-600">Signed in as {userEmail}</span>
        <button
          onClick={signOut}
          className="px-3 py-1.5 text-sm rounded-lg border"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <button
        onClick={signInEmail}
        className="px-3 py-1.5 text-sm rounded-lg border w-full sm:w-auto"
      >
        Sign in with Email
      </button>
      <button
        onClick={signInGoogle}
        className="px-3 py-1.5 text-sm rounded-lg border w-full sm:w-auto"
      >
        Continue with Google
      </button>
      {emailSent && (
        <span className="text-xs text-neutral-600">
          Check your email: {emailSent}
        </span>
      )}
    </div>
  );
}

// components/Toast.tsx
'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';
type ToastItem = {
  id: string;
  message: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number; // default 3500
};

type ToastCtx = {
  addToast: (t: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used inside <ToastProvider>');
  return c;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const api = useMemo<ToastCtx>(() => ({
    addToast(t) {
      const id = crypto.randomUUID();
      const next: ToastItem = {
        id,
        durationMs: 3500,
        variant: 'info',
        ...t,
      };
      setToasts((prev) => [...prev, next]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, next.durationMs);

      return id;
    },
    removeToast(id) {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    },
  }), []);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9999] mx-auto flex max-w-[96vw] flex-col gap-2 px-4 md:bottom-6 md:right-6 md:left-auto md:mx-0 md:w-[360px]">
        {toasts.slice(-3).map((t) => (
          <ToastCard key={t.id} item={t} onClose={() => api.removeToast(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const color =
    item.variant === 'success'
      ? 'bg-emerald-600'
      : item.variant === 'error'
      ? 'bg-red-600'
      : 'bg-neutral-900';

  return (
    <div className={`pointer-events-auto rounded-xl ${color} text-white shadow-lg transition-all`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 text-sm">{item.message}</div>
        {item.actionLabel && (
          <button
            onClick={() => { try { item.onAction?.(); } finally { onClose(); } }}
            className="rounded-md bg-white/15 px-2 py-1 text-xs font-medium hover:bg-white/25"
          >
            {item.actionLabel}
          </button>
        )}
        <button
          aria-label="Close"
          onClick={onClose}
          className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
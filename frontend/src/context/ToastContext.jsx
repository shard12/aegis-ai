import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((toast) => {
    const id = globalThis.crypto?.randomUUID?.() || `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const next = {
      id,
      tone: toast?.tone || 'neutral',
      message: toast?.message || '',
      timeoutMs: toast?.timeoutMs ?? 2800,
    };
    setItems((prev) => [...prev, next]);
    if (next.timeoutMs > 0) {
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, next.timeoutMs);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(92vw,380px)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              t.tone === 'success'
                ? 'border-emerald-300 bg-emerald-50/95 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/90 dark:text-emerald-100'
                : t.tone === 'danger'
                  ? 'border-red-300 bg-red-50/95 text-red-900 dark:border-red-700 dark:bg-red-950/90 dark:text-red-100'
                  : 'border-slate-200 bg-white/95 text-slate-800 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{t.message}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded-md px-1 text-xs text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast inside ToastProvider');
  return ctx;
}


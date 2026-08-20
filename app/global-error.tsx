'use client';

import { useEffect } from 'react';

import './globals.css';

/**
 * Last resort: replaces the root layout, so it must ship its own <html> and
 * <body>. Only fires for errors thrown in the root layout itself — everything
 * below is handled by app/error.tsx.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-5 px-4">
          <h1 className="text-3xl font-semibold">Something broke</h1>
          <p className="text-[15px] text-muted">
            The app failed to start. Reloading usually clears it.
          </p>
          {error.digest && (
            <p className="text-[12px] text-muted-2">
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-brand px-4 py-2 text-[14px] font-medium text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

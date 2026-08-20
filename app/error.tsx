'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { ArrowLeftIcon, LogoMark } from '@/components/icons';

/**
 * Route-level boundary. Catches render/data errors in the segment below it and
 * offers a retry; `reset()` re-renders the segment without a full reload.
 */
export default function Error({
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
    <div className="flex flex-col items-start gap-5 py-24">
      <LogoMark className="size-10" />

      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Something broke
        </h1>
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          This page failed to render. Your saved progress is untouched — it
          lives in this browser, not on the page.
        </p>
        {error.digest && (
          <p className="tnum mt-3 text-[12px] text-muted-2">
            Reference: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-surface-2 py-2 pl-2.5 pr-4 text-[14px] text-foreground transition-colors hover:bg-chip"
        >
          <ArrowLeftIcon className="size-4" />
          All companies
        </Link>
      </div>
    </div>
  );
}

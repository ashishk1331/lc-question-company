import Link from 'next/link';

import { ArrowLeftIcon, LogoMark } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-5 py-24">
      <LogoMark className="size-10" />
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Not found</h1>
        <p className="mt-2 text-[15px] text-muted">
          That company is not in the question bank.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-surface-2 py-2 pl-2.5 pr-4 text-[14px] text-foreground transition-colors hover:bg-chip"
      >
        <ArrowLeftIcon className="size-4" />
        All companies
      </Link>
    </div>
  );
}

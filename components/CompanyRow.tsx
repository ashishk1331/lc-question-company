'use client';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { type CompanyListItem, formatCount } from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';

type RowProps = {
  company: CompanyListItem;
  /** Server-rendered company glyph; see <CompanyGlyph />. */
  glyph?: React.ReactNode;
  /** Marks the entry the current page is showing. */
  active?: boolean;
};

export default function Row({ company, glyph, active = false }: RowProps) {
  const ids = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);

  const solved =
    hydrated && company.ids
      ? company.ids.filter((id) => ids.includes(id)).length
      : 0;

  const percent =
    company.total > 0 ? Math.round((solved / company.total) * 100) : 0;

  return (
    <li>
      <Link
        href={`/${company.key}`}
        aria-current={active ? 'page' : undefined}
        className={twMerge(
          'flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-surface lg:gap-2.5 lg:px-2.5 lg:py-2 lg:hover:bg-surface-2',
          active && 'bg-surface-2 lg:bg-surface-2',
        )}
      >
        {glyph}

        <span
          className={twMerge(
            'min-w-0 flex-1 truncate text-[15px] text-foreground lg:text-[13px]',
            active && 'font-medium',
          )}
        >
          {company.name}
        </span>

        <span className="tnum shrink-0 text-[13px] text-muted-2 lg:text-[12px]">
          {formatCount(company.total)}
        </span>

        {percent > 0 && (
          <span
            className={twMerge(
              'tnum shrink-0 rounded-full bg-chip px-2 py-1 text-[11px] font-medium text-foreground lg:px-1.5 lg:py-0.5 lg:text-[10px]',
              percent === 100 && 'bg-positive/15 text-positive',
            )}
          >
            {percent}%
          </span>
        )}
      </Link>
    </li>
  );
}

'use client';

import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import {
  type RelatedCompany,
  formatCount,
  matchTone,
  percentOf,
} from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';

type RelatedCompaniesProps = {
  companyName: string;
  items: RelatedCompany[];
  /** Server-rendered glyphs keyed by company; see <CompanyGlyph />. */
  glyphs: Record<string, React.ReactNode>;
  /** Every question here is solved, so this becomes the primary call to action. */
  complete: boolean;
};

export default function RelatedCompanies({
  companyName,
  items,
  glyphs,
  complete,
}: RelatedCompaniesProps) {
  const solvedIds = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);
  const solved = new Set(hydrated ? solvedIds : []);

  if (items.length === 0) return null;

  // The six are picked by Jaccard, but the number on the card is share of that
  // company's list — so order by what is displayed, or the column reads as
  // unsorted (41%, 45%, 38%...).
  const ordered = [...items].sort(
    (a, b) => b.shared / b.total - a.shared / a.total,
  );

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 px-1 pb-2.5">
        <h2
          className={twJoin(
            'text-[13px] font-semibold',
            complete ? 'text-foreground' : 'text-muted',
          )}
        >
          {complete
            ? `You have cleared ${companyName} — go next`
            : 'Where to go next'}
        </h2>
        <span className="hidden text-[12px] text-muted-2 sm:block">
          most overlapping question sets
        </span>
      </div>

      <div
        className={twJoin(
          'panel grid grid-cols-2 gap-px lg:grid-cols-3',
          complete && 'ring-1 ring-brand/40',
        )}
      >
        {ordered.map((item) => {
          const done = item.ids.filter((id) => solved.has(id)).length;
          const headStart = percentOf(done, item.total);
          const match = percentOf(item.shared, item.total);

          return (
            <Link
              key={item.key}
              href={`/${item.key}`}
              className="p-3.5 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center gap-2.5">
                {glyphs[item.key]}
                <span className="min-w-0 flex-1 truncate text-[14px] text-foreground">
                  {item.name}
                </span>
              </div>

              <p
                className="tnum flex items-baseline justify-between gap-2 pt-2 text-[12px] text-muted-2"
                title={`${item.shared} of ${item.name}'s ${item.total} questions are also asked at ${companyName}`}
              >
                <span>
                  <span className="text-muted">{formatCount(item.shared)}</span>{' '}
                  shared of {formatCount(item.total)}
                </span>
                <span
                  className="shrink-0 font-medium"
                  style={{ color: matchTone(match) }}
                >
                  {Math.round(match)}%
                </span>
              </p>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-chip">
                <div
                  className="h-full rounded-full bg-positive transition-[width] duration-300"
                  style={{ width: `${Math.max(headStart, done > 0 ? 3 : 0)}%` }}
                />
              </div>

              <p className="tnum pt-1.5 text-[11px] text-muted-2">
                {done > 0
                  ? `${formatCount(done)} of their list already done`
                  : 'none of their list done yet'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

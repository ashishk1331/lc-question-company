'use client';

import Link from 'next/link';

import {
  type CompanyListItem,
  DIFFICULTIES,
  DIFFICULTY_META,
  formatCount,
  percentOf,
} from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';

type CompanyCardsProps = {
  companies: CompanyListItem[];
  glyphs: Record<string, React.ReactNode>;
  limit?: number;
};

/**
 * Desktop-only overview grid. The left rail is alphabetical navigation; this is
 * the "where is the volume, and how far am I" cut across the biggest companies.
 */
export default function CompanyCards({
  companies,
  glyphs,
  limit = 12,
}: CompanyCardsProps) {
  const solvedIds = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);
  const solved = new Set(hydrated ? solvedIds : []);

  const top = [...companies]
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, limit);

  return (
    <section className="hidden lg:block">
      <h2 className="px-1 pb-2.5 text-[13px] font-semibold text-muted">
        Companies at a glance
      </h2>

      <div className="panel grid grid-cols-3 gap-px xl:grid-cols-4">
        {top.map((company) => {
          const done = company.ids
            ? company.ids.filter((id) => solved.has(id)).length
            : 0;
          const percent = Math.round(percentOf(done, company.total));

          return (
            <Link
              key={company.key}
              href={`/${company.key}`}
              className="p-3.5 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center gap-2.5">
                {glyphs[company.key]}
                <span className="min-w-0 flex-1 truncate text-[14px] text-foreground">
                  {company.name}
                </span>
                {percent > 0 && (
                  <span className="tnum shrink-0 rounded-full bg-chip px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                    {percent}%
                  </span>
                )}
              </div>

              <p className="tnum pt-2 text-[12px] text-muted-2">
                {formatCount(company.total)} questions
              </p>

              <div className="mt-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                {DIFFICULTIES.map((difficulty) => {
                  const value = company.counts?.[difficulty] ?? 0;
                  if (value === 0) return null;

                  return (
                    <span
                      key={difficulty}
                      className="rounded-full"
                      style={{
                        flexGrow: value,
                        flexBasis: 0,
                        minWidth: 3,
                        backgroundColor: DIFFICULTY_META[difficulty].color,
                      }}
                    />
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

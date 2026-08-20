'use client';

import { useMemo, useState } from 'react';

import CompanyRow from '@/components/CompanyRow';
import { SearchIcon } from '@/components/icons';
import { type CompanyListItem, formatCount } from '@/lib/stats';

type CompanyDirectoryProps = {
  companies: CompanyListItem[];
  glyphs: Record<string, React.ReactNode>;
  /** Highlighted entry, when the directory sits beside a company page. */
  activeKey?: string;
  /** Filter driven by the header search (home page). */
  query?: string;
  /** Render an own filter field instead, for pages whose header search is busy. */
  withFilter?: boolean;
};

export default function CompanyDirectory({
  companies,
  glyphs,
  activeKey,
  query = '',
  withFilter = false,
}: CompanyDirectoryProps) {
  const [ownQuery, setOwnQuery] = useState('');
  const activeQuery = withFilter ? ownQuery : query;

  const groups = useMemo(() => {
    const needle = activeQuery.trim().toLowerCase();
    const map = new Map<string, CompanyListItem[]>();

    for (const company of companies) {
      if (needle && !company.name.toLowerCase().includes(needle)) continue;
      const letter = company.name.charAt(0).toUpperCase();
      const bucket = map.get(letter);
      if (bucket) bucket.push(company);
      else map.set(letter, [company]);
    }

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [companies, activeQuery]);

  return (
    <div className="lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
      <div className="hidden lg:flex lg:items-baseline lg:justify-between lg:px-2.5 lg:pb-2.5">
        <h2 className="text-[13px] font-semibold text-foreground">Companies</h2>
        <span className="tnum text-[12px] text-muted-2">
          {formatCount(companies.length)}
        </span>
      </div>

      {withFilter && (
        <div className="relative hidden lg:block lg:px-2.5 lg:pb-2.5">
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            type="search"
            value={ownQuery}
            onChange={(event) => setOwnQuery(event.target.value)}
            placeholder="Filter companies"
            aria-label="Filter companies"
            className="w-full rounded-lg border-0 bg-surface-2 py-2 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      )}

      <nav
        aria-label="Company directory"
        className="stable-gutter lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-2 lg:pl-0.5 lg:pr-1"
      >
        {groups.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted">
            No companies match “{activeQuery}”.
          </p>
        )}

        {groups.map(([letter, items]) => (
          <div key={letter}>
            <h3 className="sticky top-0 z-10 bg-background/90 px-3 py-2 text-[13px] font-semibold text-muted backdrop-blur lg:bg-background lg:px-2.5 lg:py-1.5 lg:text-[11px] lg:backdrop-blur-none">
              {letter}
            </h3>
            <ul className="divide-y divide-hairline lg:divide-y-0">
              {items.map((company) => (
                <CompanyRow
                  key={company.key}
                  company={company}
                  glyph={glyphs[company.key]}
                  active={company.key === activeKey}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

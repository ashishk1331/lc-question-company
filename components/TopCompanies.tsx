'use client';

import Link from 'next/link';

import { type CompanyOption } from '@/components/AppHeader';

type TopCompaniesProps = {
  companies: CompanyOption[];
  /** Server-rendered glyphs keyed by company; see <CompanyGlyph />. */
  glyphs: Record<string, React.ReactNode>;
};

export default function TopCompanies({ companies, glyphs }: TopCompaniesProps) {
  if (companies.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
      {companies.map((company) => (
        <Link
          key={company.key}
          href={`/${company.key}`}
          className="flex shrink-0 items-center gap-2 rounded-full bg-surface-2 py-1.5 pl-2 pr-3.5 text-[13px] text-foreground transition-colors hover:bg-chip"
        >
          {glyphs[company.key]}
          {company.name}
        </Link>
      ))}
    </div>
  );
}

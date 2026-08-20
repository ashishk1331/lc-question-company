'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronUpDownIcon, LogoMark, SearchIcon } from '@/components/icons';

export type CompanyOption = { key: string; name: string; hasIcon: boolean };

type AppHeaderProps = {
  companies: CompanyOption[];
  currentCompany?: CompanyOption | null;
  /** Server-rendered company glyph; see <CompanyGlyph />. */
  currentGlyph?: React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
};

export default function AppHeader({
  companies,
  currentCompany,
  currentGlyph,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: AppHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    onSearchChange('');
  }

  return (
    <header className="pb-4 lg:sticky lg:top-0 lg:z-30 lg:-mx-8 lg:flex lg:h-[var(--header-h)] lg:items-center lg:border-b lg:border-hairline lg:bg-background lg:px-8 lg:pb-0 ">
      <div className="flex w-full items-center gap-3">
        <LogoMark className="size-8 shrink-0" />

        <span className="hidden shrink-0 text-[15px] font-semibold text-foreground lg:block">
          LC Company Questions
        </span>

        <div className="relative flex min-w-0 flex-1 items-center lg:flex-none">
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-surface-2 py-2 pl-2.5 pr-3">
            {currentGlyph ?? (
              <LogoMark className="size-5 shrink-0 opacity-70" />
            )}
            <span className="truncate text-[15px] text-foreground lg:max-w-[200px]">
              {currentCompany?.name ?? 'All Companies'}
            </span>
            <ChevronUpDownIcon className="size-3.5 shrink-0 text-muted" />
          </div>

          <label className="sr-only" htmlFor="company-switcher">
            Switch company
          </label>
          <select
            id="company-switcher"
            value={currentCompany?.key ?? ''}
            onChange={(event) => {
              const next = event.target.value;
              router.push(next ? `/${next}` : '/');
            }}
            className="absolute inset-y-0 left-0 w-full max-w-[240px] cursor-pointer appearance-none border-0 bg-transparent p-0 text-transparent opacity-0 focus:outline-none focus:ring-0"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company.key} value={company.key}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop keeps the field open; there is room for it. */}
        <div className="relative ml-auto hidden lg:block lg:w-72">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border-0 bg-surface-2 py-2 pl-9 pr-4 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <button
          type="button"
          onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          aria-expanded={searchOpen}
          className="shrink-0 rounded-full p-1.5 text-foreground transition-colors hover:bg-surface-2 lg:hidden"
        >
          <SearchIcon className="size-6" />
        </button>
      </div>

      {searchOpen && (
        <div className="mt-3 lg:hidden">
          <input
            ref={inputRef}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeSearch();
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border-0 bg-surface-2 px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      )}
    </header>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import Dropdown from '@/components/Dropdown';
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
    <header className="pb-4 lg:sticky lg:top-0 lg:z-30 lg:-mx-8 lg:flex lg:h-[var(--header-h)] lg:items-center lg:border-b lg:border-hairline lg:bg-background lg:px-8 lg:pb-0">
      <div className="flex w-full items-center gap-3">
        <LogoMark className="size-8 shrink-0" />

        <span className="hidden shrink-0 text-[15px] font-semibold text-foreground lg:block">
          LC Company Questions
        </span>

        <Dropdown
          label="Switch company"
          value={currentCompany?.key ?? ''}
          options={[
            { value: '', label: 'All Companies' },
            ...companies.map((company) => ({
              value: company.key,
              label: company.name,
            })),
          ]}
          onChange={(next) => router.push(next ? `/${next}` : '/')}
          filterable
          className="min-w-0 flex-1 lg:flex-none"
          menuClassName="w-64"
          renderTrigger={(selected, open) => (
            <span
              className={twJoin(
                'flex min-w-0 items-center gap-2 rounded-full bg-surface-2 py-2 pl-2.5 pr-3 transition-colors hover:bg-chip',
                open && 'ring-1 ring-brand',
              )}
            >
              {currentGlyph ?? (
                <LogoMark className="size-5 shrink-0 opacity-70" />
              )}
              <span className="truncate text-[15px] text-foreground lg:max-w-[200px]">
                {selected?.label ?? 'All Companies'}
              </span>
              <ChevronUpDownIcon className="size-3.5 shrink-0 text-muted" />
            </span>
          )}
        />

        {/* Desktop keeps the field open; there is room for it. */}
        <div className="ml-auto hidden items-center gap-2.5 rounded-full bg-surface-2 px-4 py-2 focus-within:ring-1 focus-within:ring-brand lg:flex lg:w-72">
          <SearchIcon className="size-4 shrink-0 text-muted-2" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-0"
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
        <div className="mt-3 flex items-center gap-2.5 rounded-full bg-surface-2 px-4 py-2.5 focus-within:ring-1 focus-within:ring-brand lg:hidden">
          <SearchIcon className="size-4 shrink-0 text-muted-2" />
          <input
            ref={inputRef}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeSearch();
            }}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-0"
          />
        </div>
      )}
    </header>
  );
}

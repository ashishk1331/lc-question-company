'use client';

import { twJoin } from 'tailwind-merge';

export type Tab = { key: string; label: string };

type TabStripProps = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  trailing?: React.ReactNode;
};

export default function TabStrip({
  tabs,
  active,
  onChange,
  trailing,
}: TabStripProps) {
  return (
    <div className="flex items-center gap-2 border-b border-hairline pb-3">
      <div
        role="tablist"
        className="no-scrollbar -mx-1 flex flex-1 items-center gap-5 overflow-x-auto px-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={twJoin(
                'shrink-0 whitespace-nowrap py-1 text-[22px] transition-colors',
                isActive
                  ? 'font-semibold text-foreground'
                  : 'font-normal text-muted-2 hover:text-muted',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}

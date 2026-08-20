'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import { CheckIcon, ChevronUpDownIcon, SearchIcon } from '@/components/icons';

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Accessible name for the control. */
  label: string;
  /** Adds a filter field — worth it once the list runs past a screenful. */
  filterable?: boolean;
  align?: 'start' | 'end';
  className?: string;
  menuClassName?: string;
  renderTrigger?: (
    selected: DropdownOption | undefined,
    open: boolean,
  ) => React.ReactNode;
};

export default function Dropdown({
  value,
  options,
  onChange,
  label,
  filterable = false,
  align = 'start',
  className,
  menuClassName,
  renderTrigger,
}: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selected = options.find((option) => option.value === value);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query]);

  function close(refocus = true) {
    setOpen(false);
    setQuery('');
    if (refocus) triggerRef.current?.focus();
  }

  function commit(next: string) {
    onChange(next);
    close();
  }

  // Open onto the current selection so keyboard movement starts somewhere sane.
  useEffect(() => {
    if (!open) return;
    const index = visible.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    if (filterable) filterRef.current?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, visible.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(visible.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (visible[activeIndex]) commit(visible[activeIndex].value);
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={rootRef}
      className={twMerge('relative', className)}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => (open ? close(false) : setOpen(true))}
        className="w-full text-left"
      >
        {renderTrigger ? (
          renderTrigger(selected, open)
        ) : (
          <span
            className={twJoin(
              'flex items-center gap-2 rounded-lg bg-surface-2 py-1.5 pl-2.5 pr-2 text-[12px] text-foreground transition-colors hover:bg-chip',
              open && 'ring-1 ring-brand',
            )}
          >
            <span className="truncate">{selected?.label ?? label}</span>
            <ChevronUpDownIcon className="size-3.5 shrink-0 text-muted" />
          </span>
        )}
      </button>

      {open && (
        <div
          className={twMerge(
            'absolute z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl shadow-black/50',
            align === 'end' ? 'right-0' : 'left-0',
            menuClassName,
          )}
        >
          {filterable && (
            <div className="border-b border-hairline p-2">
              <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-1.5">
                <SearchIcon className="size-4 shrink-0 text-muted-2" />
                <input
                  ref={filterRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Filter…"
                  aria-label={`Filter ${label}`}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          )}

          <ul
            role="listbox"
            aria-label={label}
            aria-activedescendant={
              visible[activeIndex] ? `${id}-${activeIndex}` : undefined
            }
            tabIndex={-1}
            className="max-h-72 overflow-y-auto p-1"
          >
            {visible.length === 0 && (
              <li className="px-3 py-6 text-center text-[13px] text-muted">
                Nothing matches
              </li>
            )}

            {visible.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li
                  key={option.value}
                  id={`${id}-${index}`}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option.value)}
                  className={twJoin(
                    'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]',
                    isActive ? 'bg-surface-2 text-foreground' : 'text-muted',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
                  {isSelected && (
                    <CheckIcon className="size-3.5 shrink-0 text-brand" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

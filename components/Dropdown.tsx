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

/**
 * Exit length, read from the motion token so JS and CSS cannot drift.
 * getComputedStyle normalises `150ms` to `.15s`, so the unit has to be
 * honoured — parseFloat alone yields 0.15 and the node unmounts instantly.
 */
function closeDurationMs() {
  if (typeof window === 'undefined') return 150;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--duration-quick')
    .trim();

  const value = parseFloat(raw);
  if (!Number.isFinite(value) || value <= 0) return 150;

  return raw.endsWith('ms') ? value : value * 1000;
}

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
  // Kept mounted for the length of the exit animation, then dropped.
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = options.find((option) => option.value === value);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query]);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(false);
    // Start keyboard movement on the current selection. Done here rather than
    // in an effect: setState inside an effect body causes a cascading render.
    const index = options.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  }

  function close(refocus = true) {
    setOpen(false);
    setQuery('');
    // Hold the node through the exit animation, reading its length from the
    // motion token so the two never drift apart.
    setClosing(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setClosing(false), closeDurationMs());
    if (refocus) triggerRef.current?.focus();
  }

  function commit(next: string) {
    onChange(next);
    close();
  }

  useEffect(() => {
    if (open && filterable) filterRef.current?.focus();
  }, [open, filterable]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

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
        openMenu();
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
        onClick={() => (open ? close(false) : openMenu())}
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

      {(open || closing) && (
        <div
          data-origin={align === 'end' ? 'top-right' : 'top-left'}
          aria-hidden={closing || undefined}
          className={twMerge(
            't-dropdown absolute z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl shadow-black/50',
            align === 'end' ? 'right-0' : 'left-0',
            closing && 'is-closing pointer-events-none',
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

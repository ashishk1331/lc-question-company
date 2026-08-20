import Link from 'next/link';

import {
  type Segment,
  formatCount,
  formatPercent,
  percentOf,
} from '@/lib/stats';

type LegendProps = {
  segments: Segment[];
  activeKey?: string | null;
  onSelect?: (key: string) => void;
};

export default function Legend({ segments, activeKey }: LegendProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className="grid grid-cols-2 gap-x-1 lg:grid-cols-4">
      {segments.map((segment) => {
        const share = percentOf(segment.value, total);
        const dimmed = Boolean(activeKey) && segment.key !== activeKey;

        const body = (
          <>
            <span
              aria-hidden="true"
              className="h-8 w-[3px] shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] leading-tight text-muted">
                {segment.label}
              </span>
              <span className="tnum block text-[15px] leading-tight text-foreground">
                {formatCount(segment.value)}
              </span>
            </span>
            <span className="tnum shrink-0 rounded-full bg-chip px-2 py-1 text-[11px] text-foreground">
              {formatPercent(share)}
            </span>
          </>
        );

        const className =
          'flex items-center gap-2.5 rounded-xl px-2 py-2.5 transition-opacity duration-200' +
          (dimmed ? ' opacity-40' : '');

        return segment.href ? (
          <Link
            key={segment.key}
            href={segment.href}
            className={`${className} hover:bg-surface-2`}
          >
            {body}
          </Link>
        ) : (
          <div key={segment.key} className={className}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

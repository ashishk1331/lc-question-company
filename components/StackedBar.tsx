import { type Segment, formatPercent, percentOf } from '@/lib/stats';

type StackedBarProps = {
  segments: Segment[];
  /** Segment key to spotlight; every other slice is dimmed. */
  activeKey?: string | null;
};

export default function StackedBar({ segments, activeKey }: StackedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const visible = segments.filter((segment) => segment.value > 0);

  if (visible.length === 0) {
    return <div className="h-[68px]" />;
  }

  return (
    <div className="flex h-[68px] items-stretch gap-1">
      {visible.map((segment) => {
        const share = percentOf(segment.value, total);
        const dimmed = Boolean(activeKey) && segment.key !== activeKey;

        return (
          <div
            key={segment.key}
            className="min-w-[7px] rounded-[10px] transition-opacity duration-200"
            style={{
              flexGrow: segment.value,
              flexBasis: 0,
              backgroundColor: segment.color,
              opacity: dimmed ? 0.28 : 1,
            }}
            title={`${segment.label} — ${formatPercent(share)}`}
          />
        );
      })}
    </div>
  );
}

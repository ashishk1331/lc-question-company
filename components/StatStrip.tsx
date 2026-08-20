export type Stat = {
  label: string;
  value: string;
  /** Optional accent for the value, e.g. a difficulty colour. */
  color?: string;
};

/**
 * Desktop-only KPI row. One panel split by hairlines rather than four floating
 * cards, so it reads as a single strip.
 */
export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="panel hidden gap-px lg:grid lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="px-4 py-3">
          <p className="truncate text-[12px] text-muted">{stat.label}</p>
          <p
            className="tnum mt-1 text-[24px] leading-none tracking-tight"
            style={{ color: stat.color ?? 'var(--foreground)' }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

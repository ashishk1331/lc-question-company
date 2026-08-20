import { TriangleUpIcon } from '@/components/icons';

type BigStatProps = {
  label: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
};

export default function BigStat({
  label,
  value,
  delta,
  deltaLabel,
}: BigStatProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-lg text-muted">{label}</p>
        {delta && (
          <p
            className="tnum flex items-center gap-1.5 text-lg font-medium text-positive"
            title={deltaLabel}
          >
            <TriangleUpIcon className="size-2.5" />
            {delta}
          </p>
        )}
      </div>
      <p className="tnum mt-1 text-[68px] font-normal leading-[1.05] tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

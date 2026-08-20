import Legend from '@/components/Legend';
import StackedBar from '@/components/StackedBar';
import { type Segment } from '@/lib/stats';

type BreakdownProps = {
  segments: Segment[];
  /** Segment key to spotlight; every other slice is dimmed. */
  activeKey?: string | null;
};

/**
 * The bar and its legend are one reading, so they live in one panel divided by
 * a hairline instead of two stacked cards.
 */
export default function Breakdown({ segments, activeKey }: BreakdownProps) {
  return (
    <div className="panel grid gap-px">
      <div className="p-1.5">
        <StackedBar segments={segments} activeKey={activeKey} />
      </div>
      <div className="p-1.5">
        <Legend segments={segments} activeKey={activeKey} />
      </div>
    </div>
  );
}

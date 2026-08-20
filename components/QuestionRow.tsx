'use client';

import { twJoin } from 'tailwind-merge';

import { DIFFICULTY_META, type Difficulty } from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { type Question } from '@/types/types';

type RowProps = {
  data: Question;
};

export default function Row({ data }: RowProps) {
  const { id, title, difficulty, link, frequency, acceptance_rate } = data;
  const ids = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);
  const toggleId = useQuestionsStore((state) => state.toggleId);

  const isFinished = hydrated && ids.includes(id);
  const meta = DIFFICULTY_META[difficulty as Difficulty] ?? {
    label: difficulty,
    color: '#8e8e93',
  };

  return (
    <li className="flex items-start gap-3 px-3 py-3.5 lg:items-center lg:py-2.5">
      <input
        type="checkbox"
        id={`q-${id}`}
        checked={isFinished}
        onChange={() => toggleId(id)}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border-hairline bg-surface-2 text-brand focus:ring-2 focus:ring-brand focus:ring-offset-0"
      />

      <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={twJoin(
            'block text-[15px] leading-snug transition-colors hover:text-brand lg:min-w-0 lg:flex-1 lg:truncate',
            isFinished ? 'text-muted-2 line-through' : 'text-foreground',
          )}
        >
          {title}
        </a>

        <div className="mt-1.5 flex items-center gap-2 lg:mt-0 lg:shrink-0 lg:gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ color: meta.color, backgroundColor: `${meta.color}1f` }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            {meta.label}
          </span>
          <span className="tnum text-[11px] text-muted-2 lg:w-14 lg:text-right">
            freq {Math.round(frequency)}
          </span>
          <span className="tnum hidden text-[11px] text-muted-2 lg:inline lg:w-16 lg:text-right">
            {Math.round(acceptance_rate * 100)}% acc
          </span>
        </div>
      </div>

      <label htmlFor={`q-${id}`} className="sr-only">
        Mark {title} as done
      </label>
    </li>
  );
}

'use client';

import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import { useQuestionsStore } from '@/store/useQuestionsStore';
import { Question } from '@/types/types';

type RowProps = {
  data: Question;
};

export default function Row({ data }: RowProps) {
  const { id, title, difficulty, link } = data;
  const ids = useQuestionsStore((state) => state.ids);
  const toggleId = useQuestionsStore((state) => state.toggleId);

  const isFinished = ids.includes(id);

  return (
    <tr>
      <td className="relative px-7 sm:w-12 sm:px-6">
        {isFinished && (
          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
        )}
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={isFinished}
          onChange={() => toggleId(id)}
        />
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 flex flex-col gap-2 items-start">
        <Link href={link}>{title}</Link>
        <span
          className={twJoin(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
            difficulty === 'EASY' &&
              'bg-green-50 text-green-700 ring-green-700/10',
            difficulty === 'MEDIUM' &&
              'bg-yellow-50 text-yellow-700 ring-yellow-700/10',
            difficulty === 'HARD' && 'bg-red-50 text-red-700 ring-red-700/10',
          )}
        >
          {difficulty.toLowerCase()}
        </span>
      </td>
    </tr>
  );
}

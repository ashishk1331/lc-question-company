'use client';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import bank from '@/data/question_bank.json';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { Question } from '@/types/types';

const questions = bank as unknown as Record<string, Question[]>;

type RowProps = {
  company: string;
};

export default function Row({ company }: RowProps) {
  const ids = useQuestionsStore((state) => state.ids);
  const company_questions_ids = questions[company].map((q) => q.id);
  const done_for_company = company_questions_ids.filter((id) =>
    ids.includes(id),
  );

  const precent = Math.round(
    (done_for_company.length / company_questions_ids.length) * 100,
  );

  return (
    <li key={company} className="flex gap-x-4 px-3 py-5 justify-between">
      <div className="min-w-0">
        <Link
          href={'/' + company}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          {company}
        </Link>
      </div>
      {precent > 0 && (
        <span
          className={twMerge(
            'inline-flex items-center rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700',
            precent === 100 && 'bg-green-100 text-green-700',
          )}
        >
          {precent}%
        </span>
      )}
    </li>
  );
}

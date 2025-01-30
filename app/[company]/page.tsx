import Link from 'next/link';

import Row from '@/components/QuestionRow';
import bank from '@/data/question_bank.json';
import { Question } from '@/types/types';

const questions = bank as unknown as Record<string, Question[]>;

export async function generateStaticParams() {
  return Object.keys(questions).map((company) => ({
    company,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const qs = questions[company.replaceAll('%20', ' ')];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 items-start">
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <Link
            href="/"
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back
          </Link>
        </div>
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {company}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the questions asked by {company}.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6" />
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Title
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {qs.slice(1).map((question) => (
                  <Row key={question.id} data={question} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

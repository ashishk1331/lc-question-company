import Row from '@/components/CompanyRow';
import TopCompanies from '@/components/TopCompanies';
import { type Data } from '@/types/types';

import bank from '../data/question_bank.json';

const questions = bank as unknown as Data;

const directory = Object.groupBy(Object.keys(questions), (q) =>
  q[0].toUpperCase(),
) as Record<string, string[]>;

const labels = Object.keys(directory);
labels.sort();

export default function Example() {
  return (
    <>
      <TopCompanies />
      <nav className="h-full overflow-y-auto" aria-label="Directory">
        {labels.map((letter) => (
          <div key={letter}>
            <div className="sticky top-0 z-10 border-y border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
              <h3>{letter}</h3>
            </div>
            <ul
              role="list"
              className="divide-y divide-gray-100"
            >
              {directory[letter].map((company) => (
                <Row key={company} company={company} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

import questions from '../data/question_bank.json';

const directory = Object.groupBy(Object.keys(questions), (q) =>
  q[0].toUpperCase(),
);
const labels = Object.keys(directory);
labels.sort();

export default function Example() {
  return (
    <nav className="h-full overflow-y-auto" aria-label="Directory">
      {labels.map((letter) => (
        <div key={letter} className="relative">
          <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
            <h3>{letter}</h3>
          </div>
          <ul role="list" className="divide-y divide-gray-100">
            {directory[letter].map((company) => (
              <li key={company} className="flex gap-x-4 px-3 py-5">
                <div className="min-w-0">
                  <a
                    href={'/' + company}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {company}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

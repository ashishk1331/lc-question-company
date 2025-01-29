import { twJoin } from 'tailwind-merge';

import questions from '../../data/question_bank.json';

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
];

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
  const qs = questions[company];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 items-start">
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <a
            href="/"
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back
          </a>
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
                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      // ref={checkbox}
                      // checked={checked}
                      // onChange={toggleAll}
                    />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Title
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {qs.slice(1).map(({ title, id, link, difficulty }) => (
                  <tr key={id}>
                    <td className="relative px-7 sm:w-12 sm:px-6">
                      {/*{selectedPeople.includes(person) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}*/}
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        // value={person.email}
                        // checked={selectedPeople.includes(person)}
                        // onChange={(e) =>
                        //   setSelectedPeople(
                        //     e.target.checked
                        //       ? [...selectedPeople, person]
                        //       : selectedPeople.filter((p) => p !== person)
                        //   )
                        // }
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 flex flex-col gap-2 items-start">
                      <a href={link}>{title}</a>
                      <span
                        className={twJoin(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                          difficulty === 'EASY' &&
                            'bg-green-50 text-green-700 ring-green-700/10',
                          difficulty === 'MEDIUM' &&
                            'bg-yellow-50 text-yellow-700 ring-yellow-700/10',
                          difficulty === 'HARD' &&
                            'bg-red-50 text-red-700 ring-red-700/10',
                        )}
                      >
                        {difficulty.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

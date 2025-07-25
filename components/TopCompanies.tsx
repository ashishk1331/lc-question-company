import { CompanyIcon } from '@trigger.dev/companyicons';
import companiesWithIcons from "@/data/companiesWithIcons.json";
import questions from "@/data/question_bank.json";

const companiesIve = Object.keys(questions);
const companies = [...(new Set(companiesIve).intersection(new Set(companiesWithIcons)))];

export default function TopCompanies() {
  return (
    <>
      <h3>Top Companies</h3>
      <div className="flex flex-wrap items-center gap-2 my-8">
        {companies.map((company) => (
          <a
            key={company}
            href={`/${company}`}
            className="px-3 py-1 rounded-md flex items-center gap-2 border border-indigo-800 bg-indigo-50 text-indigo-800 cursor-pointer"
          >
            <CompanyIcon
              name={company.toLowerCase()}
              className="size-4"
              variant="dark"
            />
            <span>{company}</span>
          </a>
        ))}
      </div>
    </>
  );
}

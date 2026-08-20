import { notFound } from 'next/navigation';

import CompanyDashboard from '@/components/CompanyDashboard';
import CompanyGlyph from '@/components/CompanyGlyph';
import { companyIndex, hasIcon, questions } from '@/lib/bank';

export function generateStaticParams() {
  return Object.keys(questions).map((company) => ({ company }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const entry = questions[company];

  if (!entry) return { title: 'Company not found' };

  return {
    title: `${entry.name} — LC Company Questions`,
    description: `LeetCode questions asked by ${entry.name}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: companyKey } = await params;
  const entry = questions[companyKey];

  if (!entry || entry.questions.length === 0) {
    notFound();
  }

  const directory = companyIndex();

  // Rendered here so the icon registry never reaches the client bundle.
  const directoryGlyphs = Object.fromEntries(
    directory.map((company) => [
      company.key,
      <CompanyGlyph
        key={company.key}
        companyKey={company.key}
        name={company.name}
        size="size-6 lg:size-5"
      />,
    ]),
  );

  return (
    <CompanyDashboard
      company={{
        key: companyKey,
        name: entry.name,
        hasIcon: hasIcon(companyKey),
      }}
      directory={directory}
      directoryGlyphs={directoryGlyphs}
      glyph={
        <CompanyGlyph companyKey={companyKey} name={entry.name} size="size-5" />
      }
      questions={entry.questions}
    />
  );
}

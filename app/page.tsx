import CompanyGlyph from '@/components/CompanyGlyph';
import HomeDashboard from '@/components/HomeDashboard';
import { companyList, totalListings, uniqueByDifficulty } from '@/lib/bank';

export default function Home() {
  const companies = companyList();

  // 67 companies now carry a logo, which is far too many chips to scroll
  // through; quick access shows the biggest ones.
  const iconCompanies = companies
    .filter((company) => company.hasIcon)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, 12)
    .map(({ key, name, hasIcon }) => ({ key, name, hasIcon }));

  // Rendered here so the icon registry never reaches the client bundle.
  const rowGlyphs = Object.fromEntries(
    companies.map((company) => [
      company.key,
      <CompanyGlyph
        key={company.key}
        companyKey={company.key}
        name={company.name}
        size="size-6 lg:size-5"
      />,
    ]),
  );

  const chipGlyphs = Object.fromEntries(
    iconCompanies.map((company) => [
      company.key,
      <CompanyGlyph
        key={company.key}
        companyKey={company.key}
        name={company.name}
        size="size-4"
      />,
    ]),
  );

  return (
    <HomeDashboard
      companies={companies}
      iconCompanies={iconCompanies}
      rowGlyphs={rowGlyphs}
      chipGlyphs={chipGlyphs}
      totalListings={totalListings()}
      uniqueByDifficulty={uniqueByDifficulty()}
    />
  );
}

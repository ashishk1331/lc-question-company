'use client';

import { useMemo, useState } from 'react';

import AppHeader, { type CompanyOption } from '@/components/AppHeader';
import BigStat from '@/components/BigStat';
import Breakdown from '@/components/Breakdown';
import CompanyCards from '@/components/CompanyCards';
import CompanyDirectory from '@/components/CompanyDirectory';
import DashboardShell from '@/components/DashboardShell';
import Description, { Keyword, Strong } from '@/components/Description';
import StatStrip from '@/components/StatStrip';
import TabStrip from '@/components/TabStrip';
import TopCompanies from '@/components/TopCompanies';
import {
  type CompanyListItem,
  DIFFICULTIES,
  DIFFICULTY_META,
  type Difficulty,
  type Segment,
  formatCount,
  formatPercent,
  percentOf,
  topSegmentsWithOther,
} from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';

// Difficulty leads: the bank caps each company at 100 questions, so the
// company split is mostly ties and reads poorly as the landing view.
const TABS = [
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'companies', label: 'Companies' },
  { key: 'progress', label: 'Progress' },
];

type HomeDashboardProps = {
  companies: CompanyListItem[];
  iconCompanies: CompanyOption[];
  /** Server-rendered glyphs keyed by company; see <CompanyGlyph />. */
  rowGlyphs: Record<string, React.ReactNode>;
  chipGlyphs: Record<string, React.ReactNode>;
  totalListings: number;
  /** Unique question ids bucketed by difficulty across the whole bank. */
  uniqueByDifficulty: Record<Difficulty, string[]>;
};

export default function HomeDashboard({
  companies,
  iconCompanies,
  rowGlyphs,
  chipGlyphs,
  totalListings,
  uniqueByDifficulty,
}: HomeDashboardProps) {
  const [tab, setTab] = useState('difficulty');
  const [query, setQuery] = useState('');

  const solvedIds = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);

  const uniqueTotal = DIFFICULTIES.reduce(
    (sum, difficulty) => sum + uniqueByDifficulty[difficulty].length,
    0,
  );

  const solvedByDifficulty = useMemo(() => {
    const solved = new Set(hydrated ? solvedIds : []);
    return DIFFICULTIES.reduce(
      (acc, difficulty) => {
        acc[difficulty] = uniqueByDifficulty[difficulty].filter((id) =>
          solved.has(id),
        ).length;
        return acc;
      },
      {} as Record<Difficulty, number>,
    );
  }, [hydrated, solvedIds, uniqueByDifficulty]);

  const solvedTotal = DIFFICULTIES.reduce(
    (sum, difficulty) => sum + solvedByDifficulty[difficulty],
    0,
  );

  const companySegments = useMemo(
    () =>
      topSegmentsWithOther(
        companies.map((company) => ({
          key: company.key,
          label: company.name,
          value: company.total,
          href: `/${company.key}`,
        })),
        7,
      ),
    [companies],
  );

  const difficultySegments: Segment[] = DIFFICULTIES.map((difficulty) => ({
    key: difficulty,
    label: DIFFICULTY_META[difficulty].label,
    value: uniqueByDifficulty[difficulty].length,
    color: DIFFICULTY_META[difficulty].color,
  }));

  const progressSegments: Segment[] = [
    ...DIFFICULTIES.map((difficulty) => ({
      key: difficulty,
      label: `${DIFFICULTY_META[difficulty].label} done`,
      value: solvedByDifficulty[difficulty],
      color: DIFFICULTY_META[difficulty].color,
    })),
    {
      key: 'remaining',
      label: 'Remaining',
      value: Math.max(uniqueTotal - solvedTotal, 0),
      color: '#4d4d52',
    },
  ];

  const topFourShare = percentOf(
    companies
      .map((company) => company.total)
      .sort((a, b) => b - a)
      .slice(0, 4)
      .reduce((sum, value) => sum + value, 0),
    totalListings,
  );

  const leader = companySegments[0];
  const dominantDifficulty = DIFFICULTIES.reduce((best, difficulty) =>
    uniqueByDifficulty[difficulty].length > uniqueByDifficulty[best].length
      ? difficulty
      : best,
  );
  const weakestDifficulty = DIFFICULTIES.reduce((worst, difficulty) =>
    percentOf(
      solvedByDifficulty[difficulty],
      uniqueByDifficulty[difficulty].length,
    ) < percentOf(solvedByDifficulty[worst], uniqueByDifficulty[worst].length)
      ? difficulty
      : worst,
  );

  const view = {
    companies: {
      label: 'Total Listings',
      value: formatCount(totalListings),
      segments: companySegments,
      description: (
        <>
          The <Strong>top 4 companies</Strong> account for{' '}
          <Strong>{formatPercent(topFourShare)}</Strong> of all listings, led by{' '}
          <Keyword color={leader?.color ?? '#ee5ff5'}>
            {leader?.label ?? '—'}
          </Keyword>{' '}
          with <Strong>{formatCount(leader?.value ?? 0)}</Strong> questions
          tracked.
        </>
      ),
    },
    difficulty: {
      label: 'Unique Questions',
      value: formatCount(uniqueTotal),
      segments: difficultySegments,
      description: (
        <>
          <Keyword color={DIFFICULTY_META[dominantDifficulty].color}>
            {DIFFICULTY_META[dominantDifficulty].label}
          </Keyword>{' '}
          problems make up{' '}
          <Strong>
            {formatPercent(
              percentOf(
                uniqueByDifficulty[dominantDifficulty].length,
                uniqueTotal,
              ),
            )}
          </Strong>{' '}
          of the bank — the tier worth <Strong>drilling first</Strong>.
        </>
      ),
    },
    progress: {
      label: 'Questions Solved',
      value: formatCount(solvedTotal),
      segments: progressSegments,
      description: (
        <>
          You have cleared <Strong>{formatCount(solvedTotal)}</Strong> of{' '}
          <Strong>{formatCount(uniqueTotal)}</Strong> unique questions. Keep{' '}
          <Keyword color={DIFFICULTY_META[weakestDifficulty].color}>
            {DIFFICULTY_META[weakestDifficulty].label}
          </Keyword>{' '}
          in the rotation to move the needle.
        </>
      ),
    },
  }[tab]!;

  const completion = percentOf(solvedTotal, uniqueTotal);

  const switcherOptions = useMemo(
    () => companies.map(({ key, name, hasIcon }) => ({ key, name, hasIcon })),
    [companies],
  );

  return (
    <>
      <AppHeader
        companies={switcherOptions}
        currentCompany={null}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search companies"
      />

      <DashboardShell
        sidebar={
          <CompanyDirectory
            companies={companies}
            glyphs={rowGlyphs}
            query={query}
          />
        }
      >
        <div className="space-y-7 lg:space-y-6">
          <TabStrip tabs={TABS} active={tab} onChange={setTab} />

          <div>
            <BigStat
              label={view.label}
              value={view.value}
              delta={solvedTotal > 0 ? `${completion.toFixed(2)}%` : undefined}
              deltaLabel="Share of unique questions solved"
            />
            <div className="pt-4">
              <Description>{view.description}</Description>
            </div>
          </div>

          <StatStrip
            stats={[
              { label: 'Companies', value: formatCount(companies.length) },
              { label: 'Unique questions', value: formatCount(uniqueTotal) },
              { label: 'Total listings', value: formatCount(totalListings) },
              {
                label: 'Solved',
                value: formatCount(solvedTotal),
                color: solvedTotal > 0 ? 'var(--positive)' : undefined,
              },
            ]}
          />

          <Breakdown segments={view.segments} />

          <TopCompanies companies={iconCompanies} glyphs={chipGlyphs} />

          <CompanyCards companies={companies} glyphs={rowGlyphs} />
        </div>
      </DashboardShell>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import AppHeader, { type CompanyOption } from '@/components/AppHeader';
import BigStat from '@/components/BigStat';
import Breakdown from '@/components/Breakdown';
import CompanyDirectory from '@/components/CompanyDirectory';
import DashboardShell from '@/components/DashboardShell';
import Description, { Keyword, Strong } from '@/components/Description';
import QuestionRow from '@/components/QuestionRow';
import RelatedCompanies from '@/components/RelatedCompanies';
import StatStrip from '@/components/StatStrip';
import TabStrip from '@/components/TabStrip';
import { ArrowLeftIcon, FilterGlyph } from '@/components/icons';
import {
  type CompanyListItem,
  DIFFICULTIES,
  DIFFICULTY_META,
  type RelatedCompany,
  countByDifficulty,
  difficultySegments,
  formatCount,
  formatPercent,
  percentOf,
} from '@/lib/stats';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { type Question } from '@/types/types';

const TABS = [
  { key: 'ALL', label: 'All' },
  ...DIFFICULTIES.map((difficulty) => ({
    key: difficulty,
    label: DIFFICULTY_META[difficulty].label,
  })),
];

type CompanyDashboardProps = {
  company: CompanyOption;
  /** Directory entries for the switcher and the desktop left rail. */
  directory: CompanyListItem[];
  directoryGlyphs: Record<string, React.ReactNode>;
  /** Server-rendered glyph for the header pill; see <CompanyGlyph />. */
  glyph: React.ReactNode;
  related: RelatedCompany[];
  relatedGlyphs: Record<string, React.ReactNode>;
  questions: Question[];
};

export default function CompanyDashboard({
  company,
  directory,
  directoryGlyphs,
  glyph,
  related,
  relatedGlyphs,
  questions,
}: CompanyDashboardProps) {
  const [tab, setTab] = useState<string>('ALL');
  const [hideSolved, setHideSolved] = useState(false);
  const [query, setQuery] = useState('');

  const solvedIds = useQuestionsStore((state) => state.ids);
  const hydrated = useQuestionsStore((state) => state.hydrated);

  const counts = useMemo(() => countByDifficulty(questions), [questions]);
  const segments = useMemo(() => difficultySegments(counts), [counts]);

  const solvedSet = useMemo(
    () => new Set(hydrated ? solvedIds : []),
    [hydrated, solvedIds],
  );
  const solvedCount = questions.filter((question) =>
    solvedSet.has(question.id),
  ).length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questions.filter((question) => {
      if (tab !== 'ALL' && question.difficulty !== tab) return false;
      if (hideSolved && solvedSet.has(question.id)) return false;
      if (needle && !question.title.toLowerCase().includes(needle))
        return false;
      return true;
    });
  }, [questions, tab, hideSolved, solvedSet, query]);

  const dominant = DIFFICULTIES.reduce((best, difficulty) =>
    counts[difficulty] > counts[best] ? difficulty : best,
  );

  const switcherOptions = useMemo(
    () => directory.map(({ key, name, hasIcon }) => ({ key, name, hasIcon })),
    [directory],
  );

  const avgAcceptance = questions.length
    ? questions.reduce((sum, q) => sum + q.acceptance_rate, 0) /
      questions.length
    : 0;

  const completion = percentOf(solvedCount, questions.length);
  const activeKey = tab === 'ALL' ? null : tab;

  return (
    <>
      <AppHeader
        companies={switcherOptions}
        currentCompany={company}
        currentGlyph={glyph}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={`Search ${company.name} questions`}
      />

      <DashboardShell
        sidebarOnMobile={false}
        sidebar={
          <CompanyDirectory
            companies={directory}
            glyphs={directoryGlyphs}
            activeKey={company.key}
            withFilter
          />
        }
      >
        <div className="space-y-7 lg:space-y-6">
          <TabStrip
            tabs={TABS}
            active={tab}
            onChange={setTab}
            trailing={
              <button
                type="button"
                onClick={() => setHideSolved((prev) => !prev)}
                aria-pressed={hideSolved}
                title={
                  hideSolved ? 'Show solved questions' : 'Hide solved questions'
                }
                className={twJoin(
                  'shrink-0 rounded-full p-1.5 transition-colors',
                  hideSolved
                    ? 'bg-brand/20 text-brand'
                    : 'text-muted hover:bg-surface-2 hover:text-foreground',
                )}
              >
                <FilterGlyph className="size-6" />
                <span className="sr-only">
                  {hideSolved
                    ? 'Show solved questions'
                    : 'Hide solved questions'}
                </span>
              </button>
            }
          />

          <div>
            <BigStat
              label="Total Questions"
              value={formatCount(questions.length)}
              delta={solvedCount > 0 ? `${completion.toFixed(2)}%` : undefined}
              deltaLabel={`${solvedCount} solved at ${company.name}`}
            />
            <div className="pt-4">
              <Description>
                <Keyword color={DIFFICULTY_META[dominant].color}>
                  {DIFFICULTY_META[dominant].label}
                </Keyword>{' '}
                problems make up{' '}
                <Strong>
                  {formatPercent(percentOf(counts[dominant], questions.length))}
                </Strong>{' '}
                of what <Strong>{company.name}</Strong> asks, so that is the
                tier to <Strong>prioritise</Strong>.
              </Description>
            </div>
          </div>

          <StatStrip
            stats={[
              {
                label: 'Total questions',
                value: formatCount(questions.length),
              },
              {
                label: 'Solved',
                value: formatCount(solvedCount),
                color: solvedCount > 0 ? 'var(--positive)' : undefined,
              },
              {
                label: 'Remaining',
                value: formatCount(questions.length - solvedCount),
              },
              {
                label: 'Avg acceptance',
                value: `${Math.round(avgAcceptance * 100)}%`,
              },
            ]}
          />

          <Breakdown segments={segments} activeKey={activeKey} />

          <section>
            <div className="flex items-baseline justify-between px-3 pb-1">
              <h2 className="text-[13px] font-semibold text-muted">
                Questions
              </h2>
              <span className="tnum text-[13px] text-muted-2">
                {formatCount(visible.length)} shown
              </span>
            </div>

            {visible.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted">
                Nothing to show with the current filters.
              </p>
            ) : (
              <ul className="divide-y divide-hairline">
                {visible.map((question) => (
                  <QuestionRow key={question.id} data={question} />
                ))}
              </ul>
            )}
          </section>

          <RelatedCompanies
            companyName={company.name}
            items={related}
            glyphs={relatedGlyphs}
            complete={questions.length > 0 && solvedCount === questions.length}
          />

          <div className="lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-surface-2 py-2 pl-2.5 pr-4 text-[14px] text-foreground transition-colors hover:bg-chip"
            >
              <ArrowLeftIcon className="size-4" />
              All companies
            </Link>
          </div>
        </div>
      </DashboardShell>
    </>
  );
}

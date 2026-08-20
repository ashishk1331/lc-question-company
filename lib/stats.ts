import { type Question } from '@/types/types';

export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; color: string }
> = {
  EASY: { label: 'Easy', color: '#4fe9b0' },
  MEDIUM: { label: 'Medium', color: '#fbbf3c' },
  HARD: { label: 'Hard', color: '#f9736a' },
};

/** Ordered palette for the stacked bar, brightest slice first. */
export const SEGMENT_COLORS = [
  '#ee5ff5',
  '#a78bfa',
  '#6e8af8',
  '#4fe9b0',
  '#fbbf3c',
  '#f97362',
  '#f0554f',
];

export const OTHER_COLOR = '#4d4d52';

export type Segment = {
  key: string;
  label: string;
  value: number;
  color: string;
  href?: string;
};

export function percentOf(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0;
}

/** "23.79 %" — matches the spacing used in the legend chips. */
export function formatPercent(value: number) {
  return `${value.toFixed(2)} %`;
}

export function formatCount(value: number) {
  return value.toLocaleString('en-US');
}

export function countByDifficulty(questions: Question[]) {
  const counts: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const question of questions) {
    // Guard unknown difficulties rather than writing a stray key into counts.
    if (question.difficulty in counts) counts[question.difficulty] += 1;
  }
  return counts;
}

export function difficultySegments(counts: Record<Difficulty, number>) {
  return DIFFICULTIES.map((difficulty) => ({
    key: difficulty,
    label: DIFFICULTY_META[difficulty].label,
    value: counts[difficulty],
    color: DIFFICULTY_META[difficulty].color,
  }));
}

/**
 * Top `limit` entries by value, with everything else folded into a trailing
 * "Other" slice so the bar always sums to the full total.
 */
export function topSegmentsWithOther(
  entries: { key: string; label: string; value: number; href?: string }[],
  limit: number,
) {
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, limit).map((entry, index) => ({
    ...entry,
    color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  const otherValue = sorted
    .slice(limit)
    .reduce((sum, entry) => sum + entry.value, 0);

  if (otherValue <= 0) return top;

  return [
    ...top,
    { key: '__other__', label: 'Other', value: otherValue, color: OTHER_COLOR },
  ];
}

/** Shape handed from the server pages to the client dashboards. */
export type CompanyListItem = {
  key: string;
  name: string;
  total: number;
  /**
   * Question ids, used to intersect with saved progress. Omitted where the
   * directory is only navigation (company pages), so 133 id arrays do not ride
   * along in every prerendered page.
   */
  ids?: string[];
  /** Per-difficulty split, supplied where the overview grid needs it. */
  counts?: Record<Difficulty, number>;
  hasIcon: boolean;
};

export type RelatedCompany = {
  key: string;
  name: string;
  /** Questions this company shares with the source company. */
  shared: number;
  total: number;
  score: number;
  /** Full id list, so the client can work out how much of it you have solved. */
  ids: string[];
  hasIcon: boolean;
};

/**
 * Colour ramp for a match percentage. Thresholds sit on the real distribution
 * of the 768 related pairs (median 20%, p75 30%), so the three tones actually
 * split the data instead of leaving one bucket empty.
 *
 * Deliberately violet/blue rather than the difficulty or progress colours —
 * a green here would read as "solved" next to the head-start bar, and
 * teal/amber/coral read as Easy/Medium/Hard everywhere else in the app.
 */
export function matchTone(percent: number) {
  if (percent >= 35) return '#a78bfa';
  if (percent >= 20) return '#6e8af8';
  return 'var(--muted)';
}

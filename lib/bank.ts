import companiesWithIcons from '@/data/companiesWithIcons.json';
import bank from '@/data/question_bank.json';
import { brandIcon } from '@/lib/icons';
import { DIFFICULTIES, type Difficulty, countByDifficulty } from '@/lib/stats';
import { type Data } from '@/types/types';

export const questions = bank as unknown as Data;

const iconNames = new Set(companiesWithIcons as string[]);

/** Full-colour icons from @trigger.dev/companyicons. */
export function hasTriggerIcon(companyKey: string) {
  return iconNames.has(companyKey);
}

export function hasIcon(companyKey: string) {
  return hasTriggerIcon(companyKey) || Boolean(brandIcon(companyKey));
}

export function companyKeys() {
  return Object.keys(questions);
}

/** Companies that actually have questions, sorted by display name. */
export function companyList() {
  return companyKeys()
    .filter((key) => questions[key].questions.length > 0)
    .map((key) => ({
      key,
      name: questions[key].name,
      total: questions[key].questions.length,
      ids: questions[key].questions.map((question) => question.id),
      counts: countByDifficulty(questions[key].questions),
      hasIcon: hasIcon(key),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function totalListings() {
  return companyKeys().reduce(
    (sum, key) => sum + questions[key].questions.length,
    0,
  );
}

/** Unique question ids across every company, bucketed by difficulty. */
export function uniqueByDifficulty() {
  const seen = new Set<string>();
  const buckets = DIFFICULTIES.reduce(
    (acc, difficulty) => {
      acc[difficulty] = [] as string[];
      return acc;
    },
    {} as Record<Difficulty, string[]>,
  );

  for (const key of companyKeys()) {
    for (const question of questions[key].questions) {
      if (seen.has(question.id)) continue;
      seen.add(question.id);
      const bucket = buckets[question.difficulty as Difficulty];
      if (bucket) bucket.push(question.id);
    }
  }

  return buckets;
}

/**
 * Directory entries without question ids — enough to navigate, small enough to
 * embed in all 133 prerendered company pages.
 */
export function companyIndex() {
  return companyList().map((company) => ({
    key: company.key,
    name: company.name,
    total: company.total,
    hasIcon: company.hasIcon,
  }));
}

/**
 * Builds data/relatedCompanies.json — the top 6 companies whose question sets
 * overlap most with each company.
 *
 * Ranked by Jaccard (|A∩B| / |A∪B|). The two intuitive alternatives are both
 * degenerate on this data: |A∩B|/|B| only ever surfaces 11-13 question
 * micro-companies that any large list swallows, and |A∩B|/|A| ranks every small
 * company's matches as 100-question giants tied at the same overlap. Jaccard is
 * the only one that returns a defensible peer set.
 *
 * Question ids are deliberately NOT stored here: the pages already have the
 * bank server-side and can look them up, which keeps this file ~30 kB instead
 * of megabytes of duplicated ids.
 *
 *   bun run related
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import rawBank from '../data/question_bank.json';
import { type Data } from '../types/types';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const bank = rawBank as unknown as Data;
const TOP_N = 6;

// A flat list rather than a Map keyed by name: every lookup below is over the
// same set, so carrying the ids alongside avoids nullable `.get()` results.
const companies = Object.keys(bank)
  .filter((key) => bank[key].questions.length > 0)
  .map((key) => ({
    key,
    name: bank[key].name,
    ids: new Set(bank[key].questions.map((question) => question.id)),
  }));

function intersectionSize(a: Set<string>, b: Set<string>) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let count = 0;
  for (const id of small) if (large.has(id)) count += 1;
  return count;
}

type Entry = { key: string; shared: number; total: number; score: number };

const related: Record<string, Entry[]> = {};

for (const source of companies) {
  const ranked = companies
    .filter((other) => other.key !== source.key)
    .map((other) => {
      const shared = intersectionSize(source.ids, other.ids);
      const union = source.ids.size + other.ids.size - shared;
      return {
        key: other.key,
        name: other.name,
        shared,
        total: other.ids.size,
        score: union > 0 ? shared / union : 0,
      };
    })
    .filter((entry) => entry.shared > 0)
    // Ties are common because of the 100-question cap, so break them
    // deterministically or the output churns between runs.
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.shared - a.shared ||
        a.name.localeCompare(b.name),
    )
    .slice(0, TOP_N)
    .map(({ key: k, shared, total, score }) => ({
      key: k,
      shared,
      total,
      score: Number(score.toFixed(4)),
    }));

  if (ranked.length) related[source.key] = ranked;
}

writeFileSync(
  join(root, 'data/relatedCompanies.json'),
  `${JSON.stringify(related, null, 2)}\n`,
);

const sizes = Object.values(related).map((r) => r.length);
console.log(`companies with questions : ${companies.length}`);
console.log(`companies with matches   : ${Object.keys(related).length}`);
console.log(`min matches for a company: ${Math.min(...sizes)}`);
for (const sample of ['google', 'paypal', 'accolite']) {
  if (!related[sample]) continue;
  console.log(`\n${bank[sample].name}:`);
  for (const r of related[sample]) {
    console.log(
      `  ${bank[r.key].name.padEnd(20)} ${String(r.shared).padStart(3)} shared of ${r.total}  (score ${r.score})`,
    );
  }
}

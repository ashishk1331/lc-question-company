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
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import bank from '../data/question_bank.json' with { type: 'json' };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOP_N = 6;

const keys = Object.keys(bank).filter((key) => bank[key].questions.length > 0);
const sets = new Map(
  keys.map((key) => [key, new Set(bank[key].questions.map((q) => q.id))]),
);

function intersectionSize(a, b) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let count = 0;
  for (const id of small) if (large.has(id)) count += 1;
  return count;
}

const related = {};

for (const key of keys) {
  const source = sets.get(key);

  const ranked = keys
    .filter((other) => other !== key)
    .map((other) => {
      const target = sets.get(other);
      const shared = intersectionSize(source, target);
      const union = source.size + target.size - shared;
      return {
        key: other,
        name: bank[other].name,
        shared,
        total: target.size,
        score: union > 0 ? shared / union : 0,
      };
    })
    .filter((entry) => entry.shared > 0)
    // Ties are common because of the 100-question cap, so break them
    // deterministically or the output churns between runs.
    .sort(
      (a, b) =>
        b.score - a.score || b.shared - a.shared || a.name.localeCompare(b.name),
    )
    .slice(0, TOP_N)
    .map(({ key: k, shared, total, score }) => ({
      key: k,
      shared,
      total,
      score: Number(score.toFixed(4)),
    }));

  if (ranked.length) related[key] = ranked;
}

writeFileSync(
  join(root, 'data/relatedCompanies.json'),
  `${JSON.stringify(related, null, 2)}\n`,
);

const sizes = Object.values(related).map((r) => r.length);
console.log(`companies with questions : ${keys.length}`);
console.log(`companies with matches   : ${Object.keys(related).length}`);
console.log(`min matches for a company: ${Math.min(...sizes)}`);
for (const sample of ['google', 'paypal', 'accolite']) {
  if (!related[sample]) continue;
  console.log(`\n${bank[sample].name}:`);
  for (const r of related[sample]) {
    console.log(`  ${bank[r.key].name.padEnd(20)} ${String(r.shared).padStart(3)} shared of ${r.total}  (score ${r.score})`);
  }
}

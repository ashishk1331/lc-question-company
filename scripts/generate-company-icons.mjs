/**
 * Builds data/companyIcons.json from simple-icons.
 *
 * The icon paths are baked into a small JSON file rather than importing
 * simple-icons at runtime: the package carries 3,400+ icons and we need ~60,
 * so this keeps the dependency to devDependencies and the data self-contained.
 *
 *   bun run icons
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import * as simpleIcons from 'simple-icons';

import bank from '../data/question_bank.json' with { type: 'json' };
import triggerIcons from '../data/companiesWithIcons.json' with { type: 'json' };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Company names whose simple-icons title differs from our display name.
 * Only genuine identities belong here — a near-miss would render another
 * company's mark (Epic Systems is healthcare software, not Epic Games).
 */
const ALIASES = {
  Snap: 'Snapchat',
  Block: 'Square', // Block was Square until 2021
  tcs: 'Tata Consultancy Services',
};

const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const byTitle = new Map();
for (const icon of Object.values(simpleIcons)) {
  if (icon && typeof icon === 'object' && icon.title && icon.path) {
    byTitle.set(normalise(icon.title), icon);
  }
}

const companies = Object.keys(bank).filter((key) => bank[key].questions.length);
const icons = {};
const matched = [];
const missing = [];

for (const key of companies) {
  const name = bank[key].name;
  const candidates = [ALIASES[name], name, name.replace(/\s+(Labs|Systems|Technologies|Group)$/i, '')];

  let icon = null;
  for (const candidate of candidates) {
    if (!candidate) continue;
    icon = byTitle.get(normalise(candidate));
    if (icon) break;
  }

  if (!icon) {
    missing.push(name);
    continue;
  }

  icons[key] = { title: icon.title, hex: `#${icon.hex}`, path: icon.path };
  matched.push(name);
}

writeFileSync(
  join(root, 'data/companyIcons.json'),
  `${JSON.stringify(icons, null, 2)}\n`,
);

const fromTrigger = companies.filter((key) => triggerIcons.includes(key));
const covered = new Set([...Object.keys(icons), ...fromTrigger]);
const initials = companies.filter((key) => !covered.has(key));

console.log(`simple-icons available  : ${byTitle.size}`);
console.log(`companies with questions: ${companies.length}`);
console.log(`matched by simple-icons : ${matched.length}`);
console.log(`only from @trigger.dev  : ${fromTrigger.filter((k) => !icons[k]).length}`);
console.log(`total with a real logo  : ${covered.size} / ${companies.length}`);
console.log(`\nstill using initials (${initials.length}):`);
console.log('  ' + initials.map((k) => bank[k].name).join(', '));

import { CompanyIcon } from '@trigger.dev/companyicons';

import { hasTriggerIcon } from '@/lib/bank';
import { brandIcon, onDarkSurface } from '@/lib/icons';

type CompanyGlyphProps = {
  companyKey: string;
  name: string;
  /** Tailwind size utility, e.g. "size-6". */
  size?: string;
};

/**
 * Server-only. `CompanyIcon` resolves names at runtime, so importing it from a
 * client component drags the whole icon registry (~350 kB) into the browser
 * bundle. Rendering here and passing the result down as a prop keeps it out.
 *
 * Order: full-colour @trigger.dev mark, then the simple-icons glyph baked into
 * data/companyIcons.json, then the company's initial.
 */
export default function CompanyGlyph({
  companyKey,
  name,
  size = 'size-6',
}: CompanyGlyphProps) {
  if (hasTriggerIcon(companyKey)) {
    return (
      <CompanyIcon
        name={companyKey}
        variant="light"
        className={`${size} shrink-0 rounded-full`}
      />
    );
  }

  const icon = brandIcon(companyKey);

  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`${size} shrink-0`}
        fill={onDarkSurface(icon.hex)}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  return (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-muted`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/**
 * eslint-config-next 16 ships flat config as default exports, so the old
 * FlatCompat shim is gone — wrapping a flat config in it throws on load.
 * `next lint` was removed in Next 16, so the ignores it applied implicitly
 * are declared here for the ESLint CLI.
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;

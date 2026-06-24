/**
 * Shared Tailwind/NativeWind design tokens for all super-app projects
 * (host + remotes). Change a default here once and every project that
 * lists this preset inherits it.
 *
 * Consumers add this to their `presets` array AFTER `nativewind/preset`,
 * then override any token in their own `theme.extend` (highest precedence):
 *
 *   presets: [
 *     require('nativewind/preset'),
 *     require('super-app-showcase-sdk/tailwind-preset'),
 *   ],
 *
 * Do NOT add `content` here — each consumer owns its own content globs.
 *
 * Per-app brand color note (Module Federation):
 * `brand` is a `50`..`900` scale and every shade resolves to a CSS variable, NOT
 * a literal. Under MF the apps share a single css-interop StyleSheet registry, so
 * a class like `bg-brand-300` can only hold ONE compiled value globally — if each
 * app compiled its own literal, the last-loaded app's color would overwrite
 * everyone's. By compiling each shade to `var(--color-brand-N)` everywhere, the
 * rule is identical in every bundle and each app picks its own ramp at runtime by
 * setting the `--color-brand-N` variables on a wrapper at its root via
 * NativeWind's `vars()` (scoped to its React subtree). The literal after each
 * comma is the fallback when no app sets that variable.
 *
 * Each app should set all ten shades in its `vars()` call so its whole ramp is
 * in-brand; the fallback literals are the default brand ramp (iOS system blue,
 * #0a84ff at 500), used for any shade an app leaves unset. There is no bare
 * `brand` (DEFAULT) token — always use an explicit shade, e.g. `bg-brand-500`.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #e6f2ff)',
          100: 'var(--color-brand-100, #cee6ff)',
          200: 'var(--color-brand-200, #9dceff)',
          300: 'var(--color-brand-300, #6cb5ff)',
          400: 'var(--color-brand-400, #3b9dff)',
          500: 'var(--color-brand-500, #0a84ff)',
          600: 'var(--color-brand-600, #086acc)',
          700: 'var(--color-brand-700, #064f99)',
          800: 'var(--color-brand-800, #043566)',
          900: 'var(--color-brand-900, #021a33)',
        },
      },
      spacing: {
        gutter: '16px',
      },
    },
  },
};

/**
 * Central registry of shared SVG icons for the whole super app (host + remotes).
 *
 * Drop a new `.svg` into `../assets/icons`, import it here, and add it to `ICONS`
 * — it becomes available as `<Icon name="..." />` in every project.
 *
 * Each icon is wrapped once with NativeWind's `cssInterop` so that a `className`
 * drives the SVG at runtime:
 *   - text color utilities (e.g. `text-brand-500`) -> the SVG's `color` prop,
 *     which becomes `currentColor` for any path authored with
 *     `fill="currentColor"` / `stroke="currentColor"`. This reuses the existing
 *     per-app `--color-brand-*` theme (see sdk/tailwind-preset.js) — the icon
 *     automatically adopts whichever brand ramp the surrounding app set via vars().
 *   - sizing utilities (e.g. `w-8 h-8`) -> the `width` / `height` props.
 */
import {cssInterop} from 'nativewind';
import type {SvgProps} from 'react-native-svg';

import Bell from '../assets/icons/bell.svg';
import Heart from '../assets/icons/heart.svg';
import Home from '../assets/icons/home.svg';
import Share from '../assets/icons/Share.svg'

export type ThemedSvg = React.FC<SvgProps & {className?: string}>;

const mapping = {
  className: {
    target: 'style',
    nativeStyleToProp: {color: true, width: true, height: true},
  },
} as const;

const themed = (Component: ThemedSvg): ThemedSvg =>
  cssInterop(Component, mapping) as ThemedSvg;

export const ICONS = {
  home: themed(Home as ThemedSvg),
  heart: themed(Heart as ThemedSvg),
  bell: themed(Bell as ThemedSvg),
  share: themed(Share as ThemedSvg),
} as const;

export type IconName = keyof typeof ICONS;

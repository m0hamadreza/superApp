import React from 'react';
import type {SvgProps} from 'react-native-svg';

import {ICONS, type IconName} from './registry';

export interface IconProps extends SvgProps {
  /** Name of a shared icon registered in `./registry`. */
  name: IconName;
  /** Shorthand for width + height (px). Overridden by explicit width/height. */
  size?: number;
  /**
   * Tailwind/NativeWind classes. Use a text-color utility to theme the icon,
   * e.g. `text-brand-500` (follows the surrounding app's brand ramp).
   */
  className?: string;
}

/**
 * Theme-aware icon backed by the shared SVG registry. Color follows the
 * `className` text color (which resolves to each app's `--color-brand-*`).
 *
 *   <Icon name="heart" className="text-brand-500" size={32} />
 */
export function Icon({name, size = 24, width, height, ...rest}: IconProps) {
  const Component = ICONS[name];

  if (!Component) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] Unknown icon name: "${name}"`);
    }
    return null;
  }

  return <Component width={width ?? size} height={height ?? size} {...rest} />;
}

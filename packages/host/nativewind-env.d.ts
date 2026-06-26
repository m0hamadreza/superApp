/// <reference types="nativewind/types" />

// `.svg` imports compile to react-native-svg components at build time
// (Re.Pack `getAssetTransformRules({ svg: 'svgr' })`).
declare module '*.svg' {
  import type React from 'react';
  import type {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

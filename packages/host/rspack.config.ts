import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';
import {NativeWindPlugin} from '@callstack/repack-plugin-nativewind';
import rspack from '@rspack/core';
import {getSharedDependencies} from 'super-app-showcase-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig(({mode, platform}) => {
  return {
    mode,
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions({enablePackageExports: true}),
      // The SDK is symlinked (pnpm), so its imports would otherwise resolve to
      // the SDK's own physical copies of these packages (different peer-hash
      // dir) — a second react-native instance double-registers native views
      // ("Tried to register two views with the same name RCTText"). Pin the
      // singleton-critical / native-registering packages to this app's copy.
      alias: {
        react: path.join(__dirname, 'node_modules/react'),
        'react-native': path.join(__dirname, 'node_modules/react-native'),
        'react-native-svg': path.join(__dirname, 'node_modules/react-native-svg'),
        'react-native-css-interop': path.join(
          __dirname,
          'node_modules/react-native-css-interop',
        ),
        nativewind: path.join(__dirname, 'node_modules/nativewind'),
      },
    },
    output: {
      uniqueName: 'sas-host',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
          type: 'javascript/auto',
        },
        // `svg: 'svgr'` makes `.svg` imports compile to react-native-svg
        // components (via @svgr/webpack, native:true) — used for shared icons.
        ...Repack.getAssetTransformRules({svg: 'svgr'}),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new NativeWindPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'host',
        dts: false,
        remotes: {
          booking: `booking@http://localhost:9000/${platform}/mf-manifest.json`,
          news: `news@http://localhost:9004/${platform}/mf-manifest.json`,
        },
        shared: {
          ...getSharedDependencies({eager: true}),
          // Share css-interop as a single instance across host + all mini-apps.
          // Both the root AND the deep imports (trailing slash) must be shared:
          // `dist/shared` defines a module-local `StyleRuleSetSymbol` that
          // native-interop checks before applying a compiled rule. With duplicate
          // instances, a mini-app re-marks the shared style registry with ITS
          // Symbol, so host styles fail the check on return (padding/text-color
          // dropped). One instance = one Symbol = styles survive navigation.
          'react-native-css-interop': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
          'react-native-css-interop/': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
        },
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };
});

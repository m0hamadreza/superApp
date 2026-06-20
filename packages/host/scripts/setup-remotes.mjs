#!/usr/bin/env node
/**
 * Bootstraps the external "view-only" remotes listed in remotes.config.json.
 *
 * For each remote it will:
 *   1. clone it (or `git pull` if already cloned) as a sibling of the monorepo
 *   2. install its dependencies
 *   3. pre-build a static Module Federation bundle for the target platform
 *
 * The host then loads each remote from a static file server (see mprocs/host*.yaml),
 * so these projects can be viewed in the app without running their dev servers.
 *
 * Usage:
 *   pnpm setup:remotes                # builds for android (default)
 *   pnpm setup:remotes --platform ios
 *   pnpm setup:remotes --only news    # restrict to one remote by name
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hostRoot = path.resolve(__dirname, '..'); // packages/host
const repoRoot = path.resolve(hostRoot, '..', '..'); // super-app-showcase
const siblingRoot = path.resolve(repoRoot, '..'); // dir that holds the cloned repos

const argv = process.argv.slice(2);
const getFlag = name => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : undefined;
};
const platform = getFlag('--platform') ?? 'android';
const only = getFlag('--only');

const {remotes} = JSON.parse(
  readFileSync(path.join(hostRoot, 'remotes.config.json'), 'utf8'),
);

const run = (cmd, args, cwd) => {
  console.log(`\n$ ${cmd} ${args.join(' ')}\n  (in ${cwd})`);
  execFileSync(cmd, args, {cwd, stdio: 'inherit'});
};

const selected = only ? remotes.filter(r => r.name === only) : remotes;
if (!selected.length) {
  console.error(`No remote named "${only}" in remotes.config.json`);
  process.exit(1);
}

for (const remote of selected) {
  const dir = path.resolve(siblingRoot, remote.dir ?? remote.name);
  console.log(`\n=== ${remote.name} → ${dir} ===`);

  if (existsSync(dir)) {
    run('git', ['pull'], dir);
  } else {
    run('git', ['clone', remote.repo, dir], siblingRoot);
  }

  run('pnpm', ['install'], dir);

  // Default build matches the Re.Pack remote convention; override per remote with `"build"` in the config.
  const buildArgs = remote.build
    ? remote.build.replaceAll('{platform}', platform).split(' ')
    : [
        'react-native',
        'bundle',
        '--platform',
        platform,
        '--dev',
        'true',
        '--entry-file',
        'index.js',
        '--bundle-output',
        `build/${platform}/index.bundle`,
        '--assets-dest',
        `build/${platform}`,
      ];
  run('pnpm', ['exec', ...buildArgs], dir);

  console.log(
    `\n✓ ${remote.name} ready — serve build/generated/${platform} on port ${remote.port}`,
  );
}

console.log(
  `\nAll remotes built for ${platform}. Run \`pnpm start\` (or the android variant) to serve them, then launch the host app.`,
);

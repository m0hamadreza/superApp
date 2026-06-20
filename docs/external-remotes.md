# External remotes (view-only micro-frontends)

How the host loads micro-frontends that live in **separate repositories** (e.g. `news`)
without running their dev servers — so you can *view* them in the app while another team
develops them elsewhere.

## Background

The host composes its UI from Module Federation remotes. Internal features
(`auth`, `booking`, `dashboard`, `shopping`) live in `packages/` of this monorepo.
**External** remotes live in their own repos cloned as siblings of this one, e.g.:

```
development/
├── super-app-showcase/        ← this repo (host + internal packages)
└── news-mini-app-showcase/    ← external remote, separate repo
```

The host declares every remote (with its port) in
[`packages/host/rspack.config.ts`](../packages/host/rspack.config.ts); `news` is served on **port 9004**.

Because we only *view* news (not develop it), it is served as a **prebuilt static bundle**
instead of a live dev server. The host can't tell the difference — Module Federation
resolves chunk URLs from the manifest location either way.

## One-time / fresh-machine setup

```bash
pnpm install
pnpm --filter host setup:remotes   # clone + install + prebuild all external remotes
pnpm start                         # serve everything, then launch the app
pnpm run:host:android              # build & install the host on the emulator
```

`setup:remotes` is config-driven by
[`packages/host/remotes.config.json`](../packages/host/remotes.config.json). Each entry:

```json
{ "name": "news", "repo": "https://github.com/callstack/news-mini-app-showcase.git", "dir": "news-mini-app-showcase", "port": 9004 }
```

For each remote the script ([`packages/host/scripts/setup-remotes.mjs`](../packages/host/scripts/setup-remotes.mjs)):
1. clones it as a sibling of the monorepo (or `git pull` if already present),
2. runs `pnpm install`,
3. pre-builds a static Module Federation bundle into `<repo>/build/generated/<platform>`.

Options:

```bash
pnpm --filter host setup:remotes                 # all remotes, android (default)
pnpm --filter host setup:remotes --only news     # one remote
pnpm --filter host setup:remotes --platform ios  # ios bundles
```

## How it is served

`pnpm start` runs [`mprocs/host.yaml`](../mprocs/host.yaml), which includes a `News` proc.
In the default (view-only) mode that proc:

- registers `adb reverse tcp:9004 tcp:9004` so the Android emulator can reach the host
  machine (internal dev servers do this automatically; our static server must do it itself), then
- serves `news-mini-app-showcase/build/generated` with `python3 -m http.server 9004`.

The static server reads files from disk per request, so a rebuild is picked up on the next
app reload — no need to restart it.

## Updating news after the team ships changes

Because it's a prebuilt bundle, `git pull` alone changes nothing in the app. Rebuild:

```bash
pnpm --filter host setup:remotes --only news   # pulls + installs + rebuilds
```

Then **reload the host app**. Caveat: if the news team bumps a *shared* dependency
(React, React Native, navigation), the host must be aligned to the same version or
Module Federation will fail at runtime.

## Developing on news (live reload)

When you actually want to edit news, run its **dev server** instead of the static server.
Both use port 9004, so only one runs at a time — the `News` proc toggles on `NEWS_DEV`:

```bash
NEWS_DEV=1 pnpm start
```

This launches `news`'s dev server (`react-native start --port 9004`) with HMR; it registers
its own `adb reverse`. Edits hot-reload — no rebuild / no `setup:remotes`. Drop the env var
to return to view-only mode.

## Adding another external remote

1. Add an entry to [`packages/host/remotes.config.json`](../packages/host/remotes.config.json)
   (name, repo, dir, port).
2. Add the remote to the host's `remotes` map in
   [`packages/host/rspack.config.ts`](../packages/host/rspack.config.ts).
3. Add a matching proc to [`mprocs/host.yaml`](../mprocs/host.yaml) (and `host-android.yaml`):
   a static server + `adb reverse` on the remote's port. *(setup:remotes only clones and
   builds — it does not generate mprocs procs.)*

## File reference

| File | Change |
|------|--------|
| `packages/host/remotes.config.json` | **New** — list of external remotes. |
| `packages/host/scripts/setup-remotes.mjs` | **New** — clone + install + prebuild script. |
| `packages/host/package.json` | Added `setup:remotes` script. |
| `mprocs/host.yaml`, `mprocs/host-android.yaml` | Added `News` proc (static serve / `NEWS_DEV` dev-server toggle). |

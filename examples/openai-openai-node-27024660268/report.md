# GitHub Actions Failure Reproduction Report

Target: openai/openai-node#27024660268
Primary job: Detect Agents SDK regressions
Primary step: pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist
Timestamp: 2026-06-05T15:43:18.9766651Z
Failure: ERR_PNPM_MISSING_TIME] The metadata of @types/node is missing the "time" field
Likely command: `pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist`

## CI Environment Hints

- Runner: ubuntu, ubuntu-24.04
- Language versions: node 22.22.3
- Matrix hints: none detected
- Setup steps:
  - Detect Agents SDK regressions / actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
  - Detect Agents SDK regressions / pnpm/action-setup@f40ffcd9367d9f12939873eb1018b921a783ffaa
  - Detect Agents SDK regressions / Running self-installer...

## Local Reproduction

Run `./repro.sh` from a fresh checkout of the failing branch or commit.

## Failure Context

```text
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:15.6519286Z env:
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:15.6519716Z   PNPM_HOME: /home/runner/setup-pnpm/node_modules/.bin
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:15.6520258Z ##[endgroup]
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:17.8064258Z Progress: resolved 1, reused 0, downloaded 0, added 0
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.4856621Z [WARN] The metadata of openai is missing the "time" field; skipping the minimumReleaseAge check for this package.
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.7190643Z [WARN] The metadata of @tailwindcss/vite is missing the "time" field; skipping the minimumReleaseAge check for this package.
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.8322252Z Progress: resolved 38, reused 0, downloaded 0, added 0
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9764949Z /home/runner/work/openai-node/openai-node/openai-agents-js/examples/nextjs:
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9766651Z [ERR_PNPM_MISSING_TIME] The metadata of @types/node is missing the "time" field
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9767205Z 
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9768184Z This error happened while installing a direct dependency of /home/runner/work/openai-node/openai-node/openai-agents-js/examples/nextjs
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9769075Z 
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:18.9769623Z If you cannot fix this registry issue, then set "resolution-mode" to "highest".
Detect Agents SDK regressions	UNKNOWN STEP	2026-06-05T15:43:19.1975007Z ##[error]Process completed with exit code 1.
```

## Commands Seen

- Detect Agents SDK regressions / actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5: `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5`
- Detect Agents SDK regressions / Fetching the repository: `/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +2cef22822c13cd333850abb2681a2b1d9df43a79:refs/remotes/pull/1920/merge`
- Detect Agents SDK regressions / ./scripts/bootstrap: `./scripts/bootstrap`
- Detect Agents SDK regressions / ./scripts/bootstrap: `yarn install v1.22.22`
- Detect Agents SDK regressions / ./scripts/bootstrap: `if ./scripts/utils/check-is-in-git-install.sh; then ./scripts/build && ./scripts/utils/git-swap.sh; fi`
- Detect Agents SDK regressions / ./scripts/build: `./scripts/build`
- Detect Agents SDK regressions / Fetching the repository: `/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +refs/heads/main:refs/remotes/origin/main`
- Detect Agents SDK regressions / pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist: `pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist`

## Jobs Seen

- Detect Agents SDK regressions: 367 log lines, 22 steps

## Maintainer Notes

- Attach this report to the PR or issue when asking a contributor for follow-up.
- Ask the contributor to run `./repro.sh` and paste the output if the failure does not reproduce locally.
- If the failure is CI-only, compare the environment hints above with the contributor's local setup.
# GitHub Actions Failure Reproduction Report

Target: vercel/next.js#27462426861 job 81178587791
Primary job: Test Examples (20)
Primary step: docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"
Timestamp: 2026-06-13T09:08:04.7594858Z
Failure: fatal: detected dubious ownership in repository at '/work'
Failure class: Git safe.directory ownership failure
Likely command: `docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"`

## Failure Classification

- Class: Git safe.directory ownership failure
- Meaning: Git rejected a mounted checkout because the repository ownership differs from the user inside the runner or container.
- Related commands:
  - `docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"`
- Suggested checks:
  - Re-run the failing container command with the same mounted checkout path.
  - Confirm whether the container user differs from the checkout owner.
  - If this is expected in CI, add the mounted checkout path with git config --global --add safe.directory <path> before commands that inspect Git state.

## CI Environment Hints

- Runner: ubuntu, ubuntu-24.04
- Language versions: node 20.17.6
- Matrix hints: job_value_1=20
- Setup steps:
  - Test Examples (20) / actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e
  - Test Examples (20) / pnpm install
  - Test Examples (20) / docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"

## Local Reproduction

Run `./repro.sh` from a fresh checkout of the failing branch or commit.

## Failure Context

```text
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6671773Z 
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6672299Z Attention:
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6672744Z Turborepo now collects completely anonymous telemetry regarding usage.
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6673301Z This information is used to shape the Turborepo roadmap and prioritize features.
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6674050Z You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6674651Z https://turborepo.dev/docs/telemetry
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6674833Z 
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.6675262Z • turbo 2.9.4
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.7594858Z  WARNING  failed to get git status for dirty hash: Git error: fatal: detected dubious ownership in repository at '/work'
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.7595516Z To add an exception for this directory, call:
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.7595773Z 
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.7595942Z git config --global --add safe.directory /work
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:04.7596122Z 
Test Examples (20)	UNKNOWN STEP	2026-06-13T09:08:05.2306748Z 
```

## Commands Seen

- Test Examples (20) / sudo ethtool -K eth0 tx off rx off: `sudo ethtool -K eth0 tx off rx off`
- Test Examples (20) / actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e: `/usr/bin/tar xz --strip 1 --warning=no-unknown-keyword --overwrite -C /home/runner/work/_temp/6dc27e0b-8b52-46f9-8f3b-ee49ac8a3da0 -f /home/runner/work/_temp/9a33633e-20cc-4221-9017-bb746783e8c2`
- Test Examples (20) / npm i -g corepack@0.31: `npm i -g corepack@0.31`
- Test Examples (20) / pnpm install: `pnpm install`
- Test Examples (20) / pnpm build: `pnpm build`
- Test Examples (20) / docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1": `docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"`

## Jobs Seen

- Test Examples (20): 10558 log lines, 37 steps

## Maintainer Notes

- Attach this report to the PR or issue when asking a contributor for follow-up.
- Ask the contributor to run `./repro.sh` and paste the output if the failure does not reproduce locally.
- If the failure is CI-only, compare the environment hints above with the contributor's local setup.
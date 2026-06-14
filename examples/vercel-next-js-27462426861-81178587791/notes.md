Repo: vercel/next.js

Run: https://github.com/vercel/next.js/actions/runs/27462426861

Job: 81178587791 (`Test Examples (20)`)

Stack: Node / pnpm / Docker / Playwright

Failure class: Git safe.directory ownership failure

What gha-repro-kit got right:

- `--job` allowed analysis of a large workflow job with more than 10k log lines.
- Identified the failed matrix-style job: `Test Examples (20)`.
- Captured the useful failure:
  `fatal: detected dubious ownership in repository at '/work'`.
- Found the relevant Docker reproduction command that mounts the checkout at
  `/work`.
- Classified the failure as a Git safe.directory / container ownership issue.
- Extracted runner and Node version hints.
- Ignored the Jest `Run with --passWithNoTests` hint instead of treating it as a
  shell command.

What it missed:

- The failed step name is the full Docker command, which is accurate but too
  long for a compact maintainer handoff.
- The primary failure is the first Git ownership warning, while the later Jest
  no-test-match failures are the direct test failures users would also inspect.

Next parser improvement:

- Add a compact display label for very long `Run ...` step commands while
  preserving the full command in the reproduction script.

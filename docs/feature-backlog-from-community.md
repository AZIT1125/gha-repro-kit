# Feature backlog from community pain

This backlog is based on recurring GitHub Actions pain described by developers
and maintainers on X and Reddit.

## 1. CI-only failure classifier

Detect likely causes when a job fails in CI but passes locally.

Signals:

- Linux runner with macOS-oriented project paths
- case-sensitive import/path mismatch
- missing `.env` or secret-like environment variable
- `CI=true` behavior differences
- headless browser differences
- missing service container or database
- line ending mismatch

Output:

```text
Likely CI-only causes:
- missing environment variable PASSWORD
- browser/headless mode difference
- runner OS differs from local macOS
```

## 2. Debug rerun checklist

Generate a small checklist that tells the maintainer what to enable next.

Examples:

- `ACTIONS_STEP_DEBUG=true`
- `ACTIONS_RUNNER_DEBUG=true`
- upload `junit.xml`, screenshots, Playwright reports, or test logs on failure
- add `set -x` for shell steps
- pin `ubuntu-latest` to `ubuntu-22.04` or `ubuntu-24.04` during investigation

## 3. Flaky run detector

Compare recent runs for the same workflow/job:

- fail then pass after rerun
- same test file fails repeatedly
- failure only on one matrix value
- failure started after a dependency update or runner image change

This should produce `flake.md` or a section in `report.md`.

## 4. Artifact awareness

When the log mentions artifacts or common test reporters, tell the maintainer
what to fetch:

- Playwright report
- screenshots
- videos
- JUnit XML
- coverage logs
- browser traces

Future CLI:

```bash
gha-repro-kit owner/repo --run RUN_ID --download-artifacts
```

## 5. Local runner handoff

Do not compete directly with `act`, `agent-ci`, or tmate. Instead, generate the
next command for the right tool:

```bash
act -j test
```

or:

```text
Use tmate because this looks like a real runner environment issue.
```

or:

```text
Use a local GitHub Actions debugger because the failure is inside workflow YAML,
not the project test command.
```

## 6. Service container and database hints

Detect when a workflow uses or appears to need:

- Postgres
- MySQL
- Redis
- Docker Compose
- browser services

Then add missing local reproduction hints to `repro.sh`.

## 7. CI waste mini-report

A weekly or on-demand command:

```bash
gha-repro-kit waste owner/repo --days 14
```

Report:

- rerun count
- fail-then-pass candidates
- slowest jobs
- workflows triggered on docs-only changes

This is a later feature. It should not distract from the core v0.1 failure
packet.

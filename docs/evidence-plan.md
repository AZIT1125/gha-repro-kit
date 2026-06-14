# Evidence plan

The goal of this phase is to prove that `gha-repro-kit` helps on real public
GitHub Actions failures, not only synthetic fixtures.

## Agent task specification

This is an open contribution task for automation agents and human contributors.

Goal: find one public failed GitHub Actions run, generate a reproduction packet
with `gha-repro-kit`, and add it to `examples/`.

Inputs:

- public `owner/repo`
- failed `RUN_ID`
- failed `JOB_ID` when the workflow is large
- stack and failure class, such as `Node / pnpm` or `Python / setup-python`

Expected output:

- generated `summary.md`
- generated `report.md`
- generated `repro.sh`
- generated `analysis.json`
- hand-written `notes.md`
- one new row in `examples/README.md`

Acceptance criteria:

- The GitHub Actions run URL is public.
- The example contains no secrets, tokens, private URLs, or personal data.
- `notes.md` says what `gha-repro-kit` got right, what it missed, and one next
  parser improvement.
- `npm test` passes after the example is added.

## What counts as evidence

Each real-world example should include:

1. A public failed GitHub Actions run URL.
2. The generated `summary.md`.
3. The generated `report.md`.
4. A short maintainer note:
   - Did it identify the failing job and step?
   - Did it recover the likely command?
   - Did it expose useful environment hints?
   - What was still missing?

Good examples are more important than many examples. Start with 3 repos across
different stacks:

- Node or TypeScript
- Python
- Rust, Go, Java, or a project with a service container

## Collection workflow

Find a public failed run:

```bash
gh run list --repo owner/repo --status failure --limit 10
```

Generate the packet:

```bash
node ./bin/gha-repro-kit.js owner/repo --run RUN_ID --out examples/owner-repo-RUN_ID
```

If GitHub CLI reports that too many API requests are needed, choose a failed job
ID first:

```bash
gh run view RUN_ID --repo owner/repo --json jobs \
  --jq '.jobs[] | select(.conclusion == "failure") | [.databaseId, .name] | @tsv'

node ./bin/gha-repro-kit.js owner/repo --run RUN_ID --job JOB_ID --out examples/owner-repo-RUN_ID-JOB_ID
```

If the package is installed globally, the same command can use `gha-repro-kit`
instead of `node ./bin/gha-repro-kit.js`.

Record a short note:

```text
Repo:
Run:
Stack:
Failure class:
What gha-repro-kit got right:
What it missed:
Next parser improvement:
```

## Recommended target failures

Prefer failures that match real maintainer pain:

- fails in CI but passes locally
- one failing matrix entry among many
- flaky failure that passes after rerun
- Playwright/browser test with missing artifact context
- missing secret, environment variable, service, or database
- dependency update PR that breaks a specific test command
- runner image or language version drift

## Avoid

- private logs
- logs containing secrets
- repos where the maintainer clearly does not want external debugging
- security-sensitive failures unless the project already disclosed them publicly

## Success bar for v0.1

`gha-repro-kit` is useful enough for a first public release when at least 3 real
failed runs produce packets where:

- the failing job and step are correct
- the likely failing command is correct or close
- the report contains enough context to ask a contributor for a concrete rerun
- gaps are documented as parser backlog items

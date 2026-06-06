# Evidence plan

The goal of this phase is to prove that `gha-repro-kit` helps on real public
GitHub Actions failures, not only synthetic fixtures.

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

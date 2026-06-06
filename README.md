# gha-repro-kit

`gha-repro-kit` helps small open source maintainers spend less time reading failed
GitHub Actions logs.

It turns a failed run into:

- a concise `report.md` with the failing job, step, command, and surrounding log context
- a runnable `repro.sh` scaffold for local reproduction
- a short `summary.md` that can be pasted into a PR or issue
- a machine-readable `analysis.json` for bots and follow-up automation
- CI environment hints such as runner, matrix values, setup steps, and language versions
- a short list of jobs and commands seen in the failed log
- failure classification for setup-action failures, download/archive problems,
  and native extension build failures

The first version intentionally stays narrow: it focuses on failed GitHub Actions
runs and produces artifacts maintainers can paste into a PR or issue.

## Why this exists

For many small OSS projects, the expensive part of reviewing a contributor PR is
not the code diff. It is the CI-only failure:

- the log is long
- the failing matrix entry is easy to miss
- the actual command is buried above the failure
- the contributor needs clear reproduction steps

`gha-repro-kit` makes that handoff cheaper.

The goal is not to replace CI, test runners, or code review bots. The goal is to
give maintainers a compact failure packet they can act on in minutes:

1. what failed
2. which command likely failed
3. what context matters
4. what to run locally

That makes it useful even before any AI integration is configured.

## Install

```bash
npm install -g gha-repro-kit
```

For local development:

```bash
npm install
npm link
```

## Usage

Analyze an existing failed log:

```bash
gha-repro-kit --log-file ./failed.log --out ./repro
```

Analyze a GitHub Actions run with the GitHub CLI:

```bash
gha-repro-kit owner/repo --run 123456789 --out ./repro
```

For large workflows, GitHub CLI may refuse to fetch all failed job logs at once.
List failed jobs and pass a specific job ID:

```bash
gh run view 123456789 --repo owner/repo --json jobs \
  --jq '.jobs[] | select(.conclusion == "failure") | [.databaseId, .name] | @tsv'

gha-repro-kit owner/repo --run 123456789 --job 987654321 --out ./repro
```

You can also use a job ID directly:

```bash
gha-repro-kit --repo owner/repo --job 987654321 --out ./repro
```

Or pass the run URL:

```bash
gha-repro-kit https://github.com/owner/repo/actions/runs/123456789
```

The GitHub run mode uses:

```bash
gh run view <run-id> --repo <owner/repo> --log-failed
```

If that fails, authenticate with `gh auth login` or download the log and use
`--log-file`.

## GitHub Action

Use the action to generate a reproduction packet for the current run:

```yaml
name: CI failure packet

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]

jobs:
  packet:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: owner/gha-repro-kit@v0
        with:
          repo: ${{ github.repository }}
          run-id: ${{ github.event.workflow_run.id }}
          out: gha-repro-output
      - uses: actions/upload-artifact@v4
        with:
          name: gha-repro-output
          path: gha-repro-output/
```

## Example output

```text
Wrote /repo/repro/report.md
Wrote /repo/repro/repro.sh
```

`report.md` includes:

```text
Primary job: test
Primary step: Run tests
Failure: packages/parser/tokenize.test.ts
Likely command: pnpm test packages/parser
Runner: ubuntu
Language versions: node 20.19.0
```

`summary.md` is intentionally short enough to paste into a PR discussion.

## Failure classes

The parser includes a small set of maintainer-focused classifiers:

- GitHub Action setup step failures, such as `actions/setup-python` requesting a
  version that is unavailable on the runner. These are marked as having no
  direct local reproduction command.
- Download/archive extraction failures, such as `curl` followed by `tar` or
  `gzip: stdin: not in gzip format`. Reports suggest checking redirects,
  authentication, rate limits, and the downloaded file contents.
- Native extension build failures involving tools such as `maturin`, `cargo`,
  `rustc`, or PyO3. Reports point maintainers toward Python/Rust toolchain and
  dependency checks.

## Real-world evidence

The `examples/` directory contains generated packets from public failed GitHub
Actions runs across Node, Python, and Rust projects. Each example includes a
short `notes.md` describing what the tool got right, what it missed, and the
next parser improvement.

Current examples include:

- `openai/openai-node`: pnpm dependency metadata failure
- `BurntSushi/ripgrep`: downloaded archive was not gzip
- `psf/black`: unavailable Python prerelease in `actions/setup-python`
- `pydantic/pydantic`: native Rust/Python extension build failure in a large
  workflow, analyzed with `--job`

## Roadmap

- Generate a Dockerfile or devcontainer when CI setup is inferable
- Compare failed runs against previous successful runs
- Comment `summary.md` on failed PR checks
- Detect flaky failures by comparing repeated failed runs
- Optional OpenAI-powered log summarization and contributor-facing replies

## Maintainer impact

This project is designed for public OSS repositories where maintainers review
external PRs in limited spare time. The intended success metric is simple:

> Can a maintainer understand and reproduce a CI-only failure without reading the
> full raw log?

If the answer is yes, the contributor gets a clearer reply and the maintainer
gets some time back.

`gha-repro-kit` is especially aimed at small maintainers who do not have a
dedicated CI/release engineering team. The tool keeps the raw log available, but
turns it into a compact handoff that can be pasted into an issue, PR comment, or
maintainer note.

## Project status

This is an early MVP. The CLI works best on logs emitted by:

```bash
gh run view <run-id> --log-failed
```

Issues and PRs that include real failed logs are especially useful.

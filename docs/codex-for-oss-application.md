# Codex for Open Source Application Notes

## Why this repository qualifies

`gha-repro-kit` helps small OSS maintainers turn failed GitHub Actions runs into
`report.md`, `summary.md`, `repro.sh`, and `analysis.json`. It targets a common
maintenance bottleneck: long CI logs from contributor PRs. The MVP already
handles public real-world failures from Node, Python, and Rust projects,
including large workflows via `--job`.

Character count: 357

## How API credits would be used

API credits would add optional AI summaries on top of the deterministic parser:
group related failures, draft contributor-facing PR replies, compare repeated CI
runs for flakiness, and suggest safer local reproduction commands. The goal is
to reduce maintainer review load while keeping generated artifacts transparent
and useful without AI.

Character count: 342

## Anything else

The project is intentionally maintainer-first: it does not replace CI or code
review bots. It creates a compact failure packet from raw GitHub Actions logs so
maintainers can respond faster, ask contributors for the right evidence, and
avoid rereading huge logs for every failed PR.

Character count: 286

# Maintainer workflow

This project is built around a small OSS maintainer's actual CI failure loop.

## Before

1. A contributor opens a PR.
2. GitHub Actions fails in one matrix entry.
3. The maintainer opens a long raw log.
4. The failing command is several screens above the error.
5. The maintainer asks the contributor to reproduce the issue, but the request is vague.

## After

1. `gha-repro-kit` reads the failed GitHub Actions log.
2. It writes a compact failure packet:
   - `summary.md` for the PR conversation
   - `report.md` for detailed context
   - `repro.sh` for local reproduction
   - `analysis.json` for automation
3. The maintainer can reply with a concrete command and environment hints.

## What this deliberately does not do

- It does not try to be a general CI vendor.
- It does not require an LLM to be useful.
- It does not hide the raw evidence from the maintainer.

The narrow job is to turn "CI failed somewhere in this log" into "run this
command under this likely environment and inspect this context."

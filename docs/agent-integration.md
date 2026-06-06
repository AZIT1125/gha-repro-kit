# Agent Integration

`gha-repro-kit` is being shaped so agents can call it as a small, deterministic
tool when they need GitHub Actions failure context.

The current integration target is simple:

```bash
gha-repro-kit --log-file ./failed.log --json --no-files
```

This returns JSON on stdout and does not write files. Agents that want maintainer
handoff artifacts can omit `--no-files`.

## Metadata

The repository exposes two AI-readable files:

- `llms.txt`: concise project context for language models
- `agent-card.json`: structured service/capability metadata for automation

`agent-card.json` describes supported invocations, outputs, side effects, safety
constraints, and future protocol readiness.

## Current Contract

The JSON response uses this top-level shape:

```json
{
  "schemaVersion": 1,
  "analysis": {},
  "artifacts": null
}
```

See `docs/analysis-json.md` for the `analysis` field guide.

When files are written, `artifacts` contains absolute paths to:

- `report.md`
- `summary.md`
- `repro.sh`
- `analysis.json`

## Protocol Readiness

The project is not implementing x402, ERC-8004, ERC-8126, or ERC-8183 yet. The
Phase 2 goal is to make the tool easy to discover and call before adding hosted
payment, identity, verification, or escrow layers.

Future hosted-agent work can build on this order:

1. Keep the CLI and JSON output stable.
2. Add an HTTP wrapper around the same analysis contract.
3. Add optional x402 payment for hosted analysis requests.
4. Publish agent identity/discovery metadata for ERC-8004 style ecosystems.
5. Add endpoint verification metadata for ERC-8126 style ecosystems.
6. Consider ERC-8183 style job or escrow flows only after real demand appears.

## Safety Defaults

- The tool does not execute generated reproduction commands.
- The MVP does not require OpenAI API access.
- The MVP does not require payment.
- GitHub run/job analysis uses the GitHub CLI and GitHub Actions read access.

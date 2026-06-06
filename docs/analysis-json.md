# analysis.json

`analysis.json` is the machine-readable parser output used by agents, bots, and
follow-up tools.

For stdout JSON, the top-level response is:

```json
{
  "schemaVersion": 1,
  "analysis": {},
  "artifacts": null
}
```

When files are written, `analysis.json` contains only the `analysis` object.

## Stable Entry Points

These fields are the safest fields for automation to consume:

- `target`: requested repo/run/job context
- `primaryFailure`: first detected failure-like line plus surrounding context
- `failureClass`: maintainer-focused classification and recommendations
- `commands`: recent command-like lines detected before or around the failure
- `environment`: runner, matrix, setup step, and language hints
- `jobs`: jobs and steps seen in the log

## primaryFailure

`primaryFailure` is a parser inference, not proof of root cause.

Important fields:

- `job`: job name from the log, or `unknown`
- `step`: step name from the log, or inferred `Run ...` group
- `lineNumber`: 1-based line number in the parsed log
- `message`: detected failure message
- `context`: nearby raw log lines for verification
- `nearestCommand`: closest earlier command-like line, or `null`

Agents should quote or inspect `context` before proposing a code fix.

## failureClass

`failureClass` describes the maintainer-facing failure type.

Current IDs:

- `action-step`: failure appears to be inside a GitHub Action setup step
- `download-archive`: archive extraction failed after a download
- `native-extension`: Rust/native Python package build failed
- `generic`: no specialized class matched

Important fields:

- `id`: stable class identifier
- `label`: human-readable label
- `localRepro`: whether a local shell repro is likely meaningful
- `summary`: short explanation
- `recommendations`: checks to try before changing source code
- `relatedCommands`: class-specific commands, when available

If `localRepro` is `false`, agents should not invent a local repro command.

## environment

`environment` contains hints extracted from job names, setup steps, and log
messages.

Fields:

- `runner`: values such as `ubuntu`, `windows`, `macos`, or runner image names
- `matrix`: inferred matrix values
- `languages`: detected language versions
- `setupSteps`: setup/install/cache steps seen in the log

These are hints. Agents should treat missing values as unknown, not as defaults.

## Artifacts

When `--no-files` is not used, stdout JSON includes:

```json
{
  "artifacts": {
    "report": "/absolute/path/report.md",
    "repro": "/absolute/path/repro.sh",
    "summary": "/absolute/path/summary.md",
    "analysis": "/absolute/path/analysis.json"
  }
}
```

Agents may attach `summary.md` to an issue or PR comment after human review.
They should not execute `repro.sh` automatically.

## Compatibility Notes

- `schemaVersion: 1` covers the current stdout wrapper shape.
- New optional fields may be added without a major change.
- Existing field meaning should remain stable within `schemaVersion: 1`.
- Consumers should ignore unknown fields.

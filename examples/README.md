# Real-world examples

These examples were generated from public failed GitHub Actions runs.

They are not hand-authored ideal cases. They are used to check whether
`gha-repro-kit` can produce a useful maintainer handoff from real logs.

## Examples

| Repo | Stack | Run | Failure class | Result |
| --- | --- | --- | --- | --- |
| [openai/openai-node](openai-openai-node-27024660268) | Node / pnpm | 27024660268 | package metadata / dependency install | Good command and environment extraction |
| [pydantic/pydantic](pydantic-pydantic-27012427463-79719039881) | Python / Rust extension | 27012427463 / job 79719039881 | native extension compile failure | Proves `--job` support for large workflows |
| [BurntSushi/ripgrep](BurntSushi-ripgrep-26858976307) | Rust / cross compile | 26858976307 | downloaded archive was not gzip | Good failure and matrix extraction, step name still noisy |
| [psf/black](psf-black-26904107152) | Python / setup-python | 26904107152 | unavailable Python pre-release version | Good failure and environment extraction, no local command inferred |

## What this proved

- The CLI can fetch and analyze public failed runs using `gh run view --log-failed`.
- `gh` emits a 3-column log format with `UNKNOWN STEP`; the parser now handles it.
- ANSI-colored shell lines need cleanup before command/failure detection.
- GitHub post-job cleanup commands should not be treated as reproduction commands.
- Very large workflows need `--job` so GitHub CLI can fetch one failed job log.

## Backlog found from real logs

- Improve multi-line `Run` step names so comments do not become step names.
- Extract working directory hints from logs.
- Detect more package-manager-specific failures such as lockfile drift, registry
  metadata errors, and missing peer dependencies.

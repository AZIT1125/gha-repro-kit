Repo: pydantic/pydantic

Run: https://github.com/pydantic/pydantic/actions/runs/27012427463

Job: 79719039881 (`Lint 3.12`)

Stack: Python / Rust native extension / uv

Failure class: native extension compile failure

What gha-repro-kit got right:

- `--job` allowed analysis of a large workflow that GitHub CLI refused to fetch as a whole.
- Identified the failed job: `Lint 3.12`.
- Identified the failed step and reproduction command:
  `uv sync --all-packages --group linting --all-extras`.
- Captured the actionable failure:
  `could not compile pydantic-core (lib) due to 10 previous errors`.
- Extracted runner and Python version hints.

What it missed:

- The failure context contains Rust compiler details, but the summary does not yet classify it as a Rust/native extension failure.
- The report does not extract the first Rust compiler error code from earlier in the log.

Next parser improvement:

- Add a native-extension failure classifier for `maturin`, `cargo`, `pyo3`, and `rustc` errors inside Python workflows.

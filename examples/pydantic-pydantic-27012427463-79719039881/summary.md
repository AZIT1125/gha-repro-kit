## CI failure reproduction packet

- Failed job: Lint 3.12
- Failed step: uv sync --all-packages --group linting --all-extras
- Failure: could not compile `pydantic-core` (lib) due to 10 previous errors
- Likely command: `uv sync --all-packages --group linting --all-extras`
- Environment: ubuntu, ubuntu-24.04; python 3.12

Maintainer handoff:

1. Check `report.md` for the surrounding log context.
2. Run `./repro.sh` from a clean checkout of the failing branch.
3. If it does not reproduce, compare the CI environment hints against the local setup.
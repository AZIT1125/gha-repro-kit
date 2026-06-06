## CI failure reproduction packet

- Failed job: lint
- Failed step: Installed versions
- Failure: The version '3.15' with architecture 'x64' was not found for Ubuntu 24.04.
- Likely command: unknown
- Environment: ubuntu, ubuntu-24.04; python 3.15

Maintainer handoff:

1. Check `report.md` for the surrounding log context.
2. Run `./repro.sh` from a clean checkout of the failing branch.
3. If it does not reproduce, compare the CI environment hints against the local setup.
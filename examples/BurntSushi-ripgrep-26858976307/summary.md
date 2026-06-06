## CI failure reproduction packet

- Failed job: test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)
- Failed step: # In the past, new releases of 'cross' have broken CI. So for now, we
- Failure: gzip: stdin: not in gzip format
- Likely command: `tar xf cross-x86_64-unknown-linux-musl.tar.gz`
- Environment: ubuntu, ubuntu-24.04; rust 1.96.0

Maintainer handoff:

1. Check `report.md` for the surrounding log context.
2. Run `./repro.sh` from a clean checkout of the failing branch.
3. If it does not reproduce, compare the CI environment hints against the local setup.
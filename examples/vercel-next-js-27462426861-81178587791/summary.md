## CI failure reproduction packet

- Failed job: Test Examples (20)
- Failed step: docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"
- Failure: fatal: detected dubious ownership in repository at '/work'
- Failure class: Git safe.directory ownership failure
- Likely command: `docker run --rm -v $(pwd):/work mcr.microsoft.com/playwright:v1.35.1-focal /bin/bash -c "cd /work && curl -s https://install-node.vercel.app/v20 | FORCE=1 bash && node -v && corepack enable > /dev/null && NEXT_TEST_JOB=1 NEXT_TEST_MODE=start xvfb-run node run-tests.js --type examples >> /proc/1/fd/1"`
- Environment: ubuntu, ubuntu-24.04; node 20.17.6

Maintainer handoff:

1. Check `report.md` for the surrounding log context.
2. Run `./repro.sh` from a clean checkout of the failing branch.
3. If it does not reproduce, compare the CI environment hints against the local setup.
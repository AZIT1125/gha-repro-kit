# GitHub Actions Failure Reproduction Report

Target: BurntSushi/ripgrep#26858976307
Primary job: test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)
Primary step: # In the past, new releases of 'cross' have broken CI. So for now, we
Timestamp: 2026-06-03T01:54:40.5056471Z
Failure: gzip: stdin: not in gzip format
Likely command: `tar xf cross-x86_64-unknown-linux-musl.tar.gz`

## CI Environment Hints

- Runner: ubuntu, ubuntu-24.04
- Language versions: rust 1.96.0
- Matrix hints: job_value_1=stable-s390x, job_value_2=ubuntu-latest, job_value_3=stable, job_value_4=s390x-unknown-linux-gnu
- Setup steps:
  - test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / ci/ubuntu-install-packages
  - test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / : install rustup if needed
  - test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / rustup toolchain install stable --profile minimal --no-self-update

## Local Reproduction

Run `./repro.sh` from a fresh checkout of the failing branch or commit.

## Failure Context

```text
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.3865244Z   CARGO_TERM_COLOR: always
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.3865805Z ##[endgroup]
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.4003787Z   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.4006150Z                                  Dload  Upload   Total   Spent    Left  Speed
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.4006708Z 
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5009428Z   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5010207Z 100 55118  100 55118    0     0   534k      0 --:--:-- --:--:-- --:--:--  538k
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5056132Z 
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5056471Z gzip: stdin: not in gzip format
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5057537Z tar: Child returned status 1
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5058004Z tar: Error is not recoverable: exiting now
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5073240Z ##[error]Process completed with exit code 2.
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.5235910Z Post job cleanup.
test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)	UNKNOWN STEP	2026-06-03T01:54:40.6223947Z [command]/usr/bin/git version
```

## Commands Seen

- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / : enable colors in Cargo output: `: enable colors in Cargo output`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / : enable Cargo sparse registry: `: enable Cargo sparse registry`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / : work around spurious network errors in curl 8.0: `: work around spurious network errors in curl 8.0`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / rustc +stable --version --verbose: `rustc +stable --version --verbose`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / # In the past, new releases of 'cross' have broken CI. So for now, we: `curl -LO "https://github.com/cross-rs/cross/releases/download/$CROSS_VERSION/cross-x86_64-unknown-linux-musl.tar.gz"`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / # In the past, new releases of 'cross' have broken CI. So for now, we: `tar xf cross-x86_64-unknown-linux-musl.tar.gz`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / # In the past, new releases of 'cross' have broken CI. So for now, we: `tar: Child returned status 1`
- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu) / # In the past, new releases of 'cross' have broken CI. So for now, we: `tar: Error is not recoverable: exiting now`

## Jobs Seen

- test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu): 554 log lines, 28 steps

## Maintainer Notes

- Attach this report to the PR or issue when asking a contributor for follow-up.
- Ask the contributor to run `./repro.sh` and paste the output if the failure does not reproduce locally.
- If the failure is CI-only, compare the environment hints above with the contributor's local setup.
# GitHub Actions Failure Reproduction Report

Target: pydantic/pydantic#27012427463 job 79719039881
Primary job: Lint 3.12
Primary step: uv sync --all-packages --group linting --all-extras
Timestamp: 2026-06-05T11:34:21.2648022Z
Failure: could not compile `pydantic-core` (lib) due to 10 previous errors
Likely command: `uv sync --all-packages --group linting --all-extras`

## CI Environment Hints

- Runner: ubuntu, ubuntu-24.04
- Language versions: python 3.12
- Matrix hints: none detected
- Setup steps:
  - Lint 3.12 / astral-sh/setup-uv@fac544c07dec837d0ccb6301d7b5580bf5edae39

## Local Reproduction

Run `./repro.sh` from a fresh checkout of the failing branch or commit.

## Failure Context

```text
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2644459Z [31m      [0m   :::
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2644966Z [31m      [0m/home/runner/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/strum-0.28.0/src/lib.rs:146:1
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2645460Z [31m      [0m    |
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2645740Z [31m      [0m146 | pub trait EnumMessage {
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2646385Z [31m      [0m    | --------------------- this is the trait that was imported
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2646890Z [31m      [0m    = help: you can use `cargo tree` to explore your dependency tree
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2647171Z 
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2647446Z [31m      [0mFor more information about this error, try `rustc --explain E0599`.
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2648022Z [31m      [0merror: could not compile `pydantic-core` (lib) due to 10 previous errors
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2648492Z [31m      [0m💥 maturin failed
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2648911Z [31m      [0m  Caused by: Failed to build a native library through cargo
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2649405Z [31m      [0m  Caused by: Cargo build finished with "exit status:
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2649878Z [31m      [0m101": `env -u CARGO PYO3_BUILD_EXTENSION_MODULE="1"
Lint 3.12	UNKNOWN STEP	2026-06-05T11:34:21.2650360Z [31m      [0mPYO3_ENVIRONMENT_SIGNATURE="cpython-3.12-64bit"
```

## Commands Seen

- Lint 3.12 / astral-sh/setup-uv@fac544c07dec837d0ccb6301d7b5580bf5edae39: `/usr/bin/tar xz --warning=no-unknown-keyword --overwrite -C /home/runner/work/_temp/4ce148f9-d137-4761-a591-a76129fa6047 -f /home/runner/work/_temp/92193d5c-3d4a-4d4d-bdf0-f0b1ddce442a`
- Lint 3.12 / astral-sh/setup-uv@fac544c07dec837d0ccb6301d7b5580bf5edae39: `/usr/bin/tar -xf /home/runner/work/_temp/cad3c1fb-567b-45b3-909b-d3f08d8fe00e/cache.tzst -P -C /home/runner/work/pydantic/pydantic --use-compress-program unzstd`
- Lint 3.12 / uv sync --all-packages --group linting --all-extras: `uv sync --all-packages --group linting --all-extras`
- Lint 3.12 / uv sync --all-packages --group linting --all-extras: `uv pip install pip`

## Jobs Seen

- Lint 3.12: 741 log lines, 16 steps
- unknown: 7 log lines, 1 steps

## Maintainer Notes

- Attach this report to the PR or issue when asking a contributor for follow-up.
- Ask the contributor to run `./repro.sh` and paste the output if the failure does not reproduce locally.
- If the failure is CI-only, compare the environment hints above with the contributor's local setup.
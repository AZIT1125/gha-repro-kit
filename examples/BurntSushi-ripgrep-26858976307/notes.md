Repo: BurntSushi/ripgrep

Run: https://github.com/BurntSushi/ripgrep/actions/runs/26858976307

Stack: Rust / cross compilation

Failure class: archive/download failure during tool setup

What gha-repro-kit got right:

- Identified the failed matrix job:
  `test (stable-s390x, ubuntu-latest, stable, s390x-unknown-linux-gnu)`.
- Extracted matrix values for toolchain, runner, channel, and target.
- Captured the useful failure:
  `gzip: stdin: not in gzip format`.
- Found a nearby shell command:
  `tar xf cross-x86_64-unknown-linux-musl.tar.gz`.
- Extracted Rust and runner hints.

What it missed:

- The step name is noisy because the failing GitHub `Run` block starts with comments.
- The better diagnostic would mention the preceding download command and URL, not only `tar`.

Next parser improvement:

- Detect download/archive pairs and include both commands in the reproduction packet.

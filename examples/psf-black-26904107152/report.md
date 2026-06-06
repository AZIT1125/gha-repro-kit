# GitHub Actions Failure Reproduction Report

Target: psf/black#26904107152
Primary job: lint
Primary step: Installed versions
Timestamp: 2026-06-03T18:15:08.7407878Z
Failure: The version '3.15' with architecture 'x64' was not found for Ubuntu 24.04.
Likely command: unknown

## CI Environment Hints

- Runner: ubuntu, ubuntu-24.04
- Language versions: python 3.15
- Matrix hints: none detected
- Setup steps:
  - lint / actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405
  - lint / Installed versions

## Local Reproduction

The log did not expose a runnable command. Inspect the context below and update `repro.sh`.

## Failure Context

```text
lint	UNKNOWN STEP	2026-06-03T18:15:07.4853661Z   check-latest: false
lint	UNKNOWN STEP	2026-06-03T18:15:07.4856838Z   token: ***
lint	UNKNOWN STEP	2026-06-03T18:15:07.4857130Z   update-environment: true
lint	UNKNOWN STEP	2026-06-03T18:15:07.4857439Z   allow-prereleases: false
lint	UNKNOWN STEP	2026-06-03T18:15:07.4857723Z   freethreaded: false
lint	UNKNOWN STEP	2026-06-03T18:15:07.4857985Z ##[endgroup]
lint	UNKNOWN STEP	2026-06-03T18:15:07.6114251Z ##[group]Installed versions
lint	UNKNOWN STEP	2026-06-03T18:15:07.6196481Z Version 3.15 was not found in the local cache
lint	UNKNOWN STEP	2026-06-03T18:15:08.7407878Z ##[error]The version '3.15' with architecture 'x64' was not found for Ubuntu 24.04.
lint	UNKNOWN STEP	The list of all available versions can be found here: https://raw.githubusercontent.com/actions/python-versions/main/versions-manifest.json
lint	UNKNOWN STEP	2026-06-03T18:15:08.7643130Z Post job cleanup.
lint	UNKNOWN STEP	2026-06-03T18:15:08.8454592Z [command]/usr/bin/git version
lint	UNKNOWN STEP	2026-06-03T18:15:08.8524574Z git version 2.54.0
lint	UNKNOWN STEP	2026-06-03T18:15:08.8563875Z Temporarily overriding HOME='/home/runner/work/_temp/6d8f86f1-40aa-49e2-90e0-159f5ba0184b' before making global git config changes
```

## Commands Seen

- No runnable commands detected.

## Jobs Seen

- lint: 192 log lines, 17 steps
- unknown: 1 log lines, 1 steps

## Maintainer Notes

- Attach this report to the PR or issue when asking a contributor for follow-up.
- Ask the contributor to run `./repro.sh` and paste the output if the failure does not reproduce locally.
- If the failure is CI-only, compare the environment hints above with the contributor's local setup.
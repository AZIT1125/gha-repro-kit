Repo: psf/black

Run: https://github.com/psf/black/actions/runs/26904107152

Stack: Python / setup-python

Failure class: unavailable Python version on runner image

What gha-repro-kit got right:

- Identified the failed job: `lint`.
- Captured the action failure:
  `The version '3.15' with architecture 'x64' was not found for Ubuntu 24.04.`
- Extracted runner hints and the requested Python version.
- Avoided treating GitHub post-job cleanup as the root cause after parser fixes.

What it missed:

- There is no meaningful local shell command to run because the failure is inside `actions/setup-python`.
- The report should explicitly say this is an action/setup failure rather than a normal project command failure.

Next parser improvement:

- Add an "action failure" section for `actions/setup-*` failures and avoid generating runnable commands for action references.

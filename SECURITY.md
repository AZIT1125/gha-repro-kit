# Security Policy

`gha-repro-kit` processes CI logs, which may accidentally contain sensitive
values. Do not include secrets or private logs in public issues.

If you find a vulnerability, please open a private security advisory on GitHub or
contact the maintainer privately before public disclosure.

## Maintainer guidance

- Prefer public logs with secrets masked by GitHub Actions.
- Review generated reports before pasting them into public PRs or issues.
- Avoid uploading artifacts that contain credentials, customer data, or private
repository details.

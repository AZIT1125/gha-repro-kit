# Contributing

Thanks for helping make CI failures less painful for OSS maintainers.

Good first contributions:

- Add a fixture from a real failed GitHub Actions log
- Improve command detection for a language or package manager
- Improve failure detection for a test runner
- Add report fields that would help a maintainer reply to a contributor

Please keep fixtures small and remove secrets, tokens, private URLs, and personal
data before opening a PR.

## Development

```bash
npm install
npm test
node ./bin/gha-repro-kit.js --log-file ./test/fixtures/sample-gh-log.txt
```

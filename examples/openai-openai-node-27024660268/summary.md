## CI failure reproduction packet

- Failed job: Detect Agents SDK regressions
- Failed step: pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist
- Failure: ERR_PNPM_MISSING_TIME] The metadata of @types/node is missing the "time" field
- Likely command: `pnpm --filter @openai/agents-core --filter @openai/agents-openai --filter @openai/agents add file:../../../openai-node/dist`
- Environment: ubuntu, ubuntu-24.04; node 22.22.3

Maintainer handoff:

1. Check `report.md` for the surrounding log context.
2. Run `./repro.sh` from a clean checkout of the failing branch.
3. If it does not reproduce, compare the CI environment hints against the local setup.
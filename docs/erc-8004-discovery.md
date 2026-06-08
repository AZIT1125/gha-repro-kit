# ERC-8004 Discovery Prep

`gha-repro-kit` is not registered on-chain as an ERC-8004 agent yet.

This repository now includes a registration candidate at:

```text
.well-known/agent-registration.json
```

The goal is discovery readiness only. This does not add payments, wallets,
escrow, hosted execution, x402, or autonomous fixes.

## Why This Exists

ERC-8004 focuses on agent identity, discovery, reputation, and validation. For
`gha-repro-kit`, the useful first step is to make the project easy for agent
directories to describe:

- name: `gha-repro-kit`
- role: CI failure analysis tool
- package: `gha-repro-kit` on npm
- source: GitHub repository
- primary agent invocation: `--json --no-files`
- payment status: none
- trust status: discovery metadata only

## Current Registration Candidate

The candidate file includes:

- `type`: ERC-8004 registration file type
- `name` and `description`
- `services` for GitHub, npm, the existing `agent-card.json`, and CLI usage
- `x402Support: false`
- `active: true`
- `supportedTrust: ["discovery"]`
- `registrations: []`

The empty `registrations` array is intentional. It means the project has not
been minted into an ERC-8004 identity registry yet.

## When Registering For Real

If the project is registered in an ERC-8004 identity registry, update
`.well-known/agent-registration.json` with the assigned values:

```json
{
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:8453:0x..."
    }
  ]
}
```

Then update:

- `agent-card.json`
- `llms.txt`
- this document

## What Not To Add Yet

- Do not add x402 payment until there is a hosted HTTP API.
- Do not add ERC-8183 escrow until agents are actually requesting paid work.
- Do not claim validation, reputation, or wallet ownership before registration.
- Do not expose secrets, private logs, or API keys in any registration metadata.

## Practical Next Step

Use this metadata as a draft if registering through an ERC-8004 web interface,
SDK, or registry tool. The current public entry points remain:

- GitHub: `https://github.com/AZIT1125/gha-repro-kit`
- npm: `https://www.npmjs.com/package/gha-repro-kit`
- agent card: `https://raw.githubusercontent.com/AZIT1125/gha-repro-kit/main/agent-card.json`

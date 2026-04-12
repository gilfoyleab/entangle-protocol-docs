# Introduction

Entangle Protocol is a **Bittensor subnet** that provides fully decentralised cross-chain message relaying across 13 blockchain networks and 5 distinct ecosystems. It connects EVM chains (Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche), Solana, SUI, Stellar, and Cosmos chains (Cosmos Hub, Osmosis, Neutron) using a competitive, incentivised relay network.

**No bridges. No custodians. No single point of failure.** Just a decentralised network of incentivised agentic relayers — scored and rewarded by Bittensor's Yuma Consensus.

## What makes Entangle different

| Dimension | Entangle | Wormhole | LayerZero | Axelar |
|---|---|---|---|---|
| **Miner entry** | Permissionless (TAO burn) | Permissioned Guardians | Permissioned DVNs | Permissioned validators |
| **Incentive model** | Competitive TAO emissions + fees | Protocol revenue share | DVN operator fees | Validator staking rewards |
| **Source-chain watching** | Specialised scanner miners | Each Guardian node | Each DVN | Each validator |
| **Decentralisation** | Open subnet, any operator | 19 Guardian multisig | DVN operator set | Proof-of-stake set |
| **Latency target** | <60s fast chains / <90s EVM L1 | 1–5 min | <1 min | 2–5 min |
| **Fee model** | Oracle-driven per-destination | Fixed/variable | Pay-as-you-go | Fixed |
| **Chain extensibility** | ChainAdapter interface | Per-chain deployments | DVN per chain | Per-chain voting |

## Protocol at a Glance

```
Protocol Version:   2.0
Chains Supported:   13
Ecosystems:         5 (EVM, Solana, SUI, Cosmos, Stellar)
Miner Types:        2 (Scanner & Relay)
Emission Split:     30% Discovery / 70% Relay
Governance:         3-of-5 Multisig with 48h timelocks
Latency Target:     <60s (fast chains), <90s (EVM L1)
```
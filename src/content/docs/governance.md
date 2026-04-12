# Governance

## Protocol Multisig

All Entangle governance is conducted through a **3-of-5 Gnosis Safe** (EVM) or equivalent Substrate multisig. All signer addresses are published on-chain. All transactions are publicly verifiable.

| Parameter | Value |
|---|---|
| Signing threshold | 3-of-5 |
| Signer addition/removal | Requires 3-of-5 vote; replacement in same transaction |
| Transaction log | All executions publicly visible on-chain |
| Key storage | Hardware wallets; no hot signer keys |

**Per-ecosystem equivalents:**
- **Solana:** Upgrade authority held by a Squads multisig (3-of-5)
- **SUI:** Package upgrade cap owned by a 3-of-5 multisig object
- **Cosmos:** Contract admin is a CosmWasm multisig (3-of-5 threshold)
- **Stellar:** Contract admin is a Stellar multisig (3-of-5 threshold)

Signer sets are kept in sync across all chains. Any signer rotation must be applied to all chain multisigs within 24 hours.

## Operations and Timelocks

| Operation | Timelock | Trigger |
|---|---|---|
| Update Chain Configuration Registry | None | New chain, contract rotation, deprecation |
| `setBaseFee()`, `setGasBuffer()`, `setFeeSplit()` | None | Operational fee adjustments |
| `freezeOracle()` | None | Emergency |
| `withdrawRelayReserve()` | None | Operational |
| Change emission split (30/70) | **48 hours** | Governance proposal |
| `updateValidatorSet()` | **48 hours** | Validator set rotation |
| `setSignatureThreshold()` | **48 hours** | Security parameter change |
| Emergency validator key rotation | None (emergency) | Key compromise detected |
| Freeze subnet registrations | None | Emergency only |

## Major Protocol Upgrades

New ecosystem support and architectural changes follow a structured process:

1. Public RFC posted to the project GitHub repository
2. Minimum 7-day community comment period
3. Multisig review and response to substantive comments
4. 48-hour timelock on execution (where applicable)
5. Public announcement of execution transaction hash

## Bootstrapping Governance

**Phase 1 (Synthetic events, weeks 1–4 post-launch):**  
A treasury-controlled test dApp emits synthetic `MessageDispatched` events on a randomised schedule (10–50 events/day/chain). Scanner miners that correctly report receive a flat 0.50 participation score — no speed-race dynamic.

**Phase 2 (Live scoring):**  
Triggered automatically when real `MessageDispatched` events reach ≥20 per day per chain. Full rank-based scoring (1.00 / 0.70 / 0.50 / 0.20) resumes.

**Emergency Fallback Scanner:**  
If no scanner miner responds to `ChainScanSynapse` for 3 consecutive cycles (~90 seconds), validators activate a thin RPC poller built into the validator binary. Events are flagged as validator-originated — no scanner miner receives a score. This exists solely to prevent relay pipeline stalling.
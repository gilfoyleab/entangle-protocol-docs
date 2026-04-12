# Architecture Deep Dive

## Key Design Principles

**Permissionless Entry**  
Any operator can register by paying the dynamic TAO burn. No approval process, no guardian whitelist, no DVN gatekeeping. Competition is open.

**Objective Scoring**  
Every score dimension uses on-chain or cryptographically verifiable data. Validator receipt timestamps prevent self-reporting manipulation entirely.

**Sealed-Bid Auctions**  
Relay miners compete on latency and gas estimates before execution. Bid accuracy is scored. The market finds optimal pricing automatically.

**ChainAdapter Interface**  
New chains can be added without deploying new contracts. Same-ecosystem chains are zero-config additions. New ecosystems need one Python class implementing five methods.

**One Contract Per Chain**  
A single Entangle contract handles both source (`sendMessage`) and destination (`verifyMessage`) roles on every supported blockchain.

**3-of-5 Multisig Governance**  
All protocol governance through a 3-of-5 Gnosis Safe. 48h timelocks on validator set and threshold changes. All transactions publicly verifiable on-chain.

## Protocol Data Structures

### MessageEnvelope

The chain-agnostic, canonical description of a pending cross-chain message:

| Field | Description |
|---|---|
| `message_id` | sha256 of (src_chain + protocol_addr + seq + src_tx). Globally unique. |
| `src_chain` | Source chain name (e.g. `"ethereum"`, `"solana"`) |
| `src_ecosystem` | Ecosystem family: `evm`, `solana`, `sui`, `stellar`, `cosmos` |
| `src_protocol` | Entangle ProtocolHub contract address on the source chain |
| `src_tx` | Transaction hash / signature of the `MessageDispatched` event |
| `src_seq` | Monotonically increasing sequence number from the source hub |
| `src_height` | Block / slot / ledger number on the source chain |
| `src_timestamp` | Unix timestamp of source transaction confirmation |
| `dst_chain` | Target chain name |
| `dst_ecosystem` | Target ecosystem family |
| `dst_protocol` | Entangle ProtocolHub address on destination chain |
| `dst_recipient` | Application contract/account receiving the message |
| `payload_hex` | Hex-encoded raw message payload (max 8 KiB) |
| `requires_ack` | If true, source dApp expects an acknowledgement reply |

### ProofBundle

Returned by the miner as evidence of delivery:

| Field | Description |
|---|---|
| `proof_type` | One of: `evm_tx_receipt`, `solana_signature`, `sui_digest`, `stellar_hash`, `cosmos_tx_hash` |
| `relay_tx` | Primary on-chain identifier of the relay transaction |
| `dst_height` | Block / slot / ledger number on the destination chain |
| `dst_timestamp` | Unix timestamp of the relay confirmation |
| `raw` | Ecosystem-specific data (EVM receipt/logs, Solana signature/slot, SUI digest/effects, etc.) |

### RelayStatus Codes

| Code | Name | Meaning |
|---|---|---|
| 200 | `SUCCESS` | Relay confirmed on destination chain |
| 208 | `ALREADY_RELAYED` | Another miner relayed first. Partial score. |
| 202 | `PENDING` | Transaction submitted but not yet confirmed |
| 402 | `INSUFFICIENT_FUNDS` | Miner wallet has insufficient gas |
| 500 | `REVERT` | Destination contract reverted |
| 408 | `TIMEOUT` | Message not confirmed before deadline |
| 501 | `UNSUPPORTED_CHAIN` | Miner doesn't support this chain pair |
| 422 | `INVALID_PROOF` | Miner couldn't build a valid proof |
| 429 | `RATE_LIMITED` | Miner is at capacity — task shed |

## Deterministic Task IDs

Task IDs are computed deterministically so all validators assign the same ID to the same message — critical for cross-validator score consistency:

```python
task_id = sha256(
    sha256(src_chain + ":" + protocol_addr + ":" + seq + ":" + src_tx)
    + ":" + validator_hotkey[:8]
)
```

## Deployment Architecture

**Per Validator Node:**
```
┌────────────────────────────────────────────────────────────┐
│  validator-process (Python)                                │
│    ├─ BittensorClient (metagraph, axon, dendrite)          │
│    ├─ ChainAdapterRegistry (one adapter per chain)         │
│    ├─ SynapseHandlers (ChainScan, HealthCheck, Attest)     │
│    ├─ AuctionEngine (BidRequest, winner selection)         │
│    ├─ ExecutionMonitor (proof verification, scoring)       │
│    ├─ OracleSubmitter (gas price updates)                  │
│    └─ WeightCommitter (set_weights every epoch)            │
│                                                            │
│  HSM / Secrets Manager (external)                         │
│    └─ Attestation keys per dst_chain ecosystem            │
└────────────────────────────────────────────────────────────┘
```

**Per Scanner Miner Node:**
```
┌────────────────────────────────────────────────────────────┐
│  scanner-process (Python)                                  │
│    ├─ BittensorClient (axon — serves ChainScanSynapse)     │
│    ├─ ChainAdapterRegistry (source chain adapters only)    │
│    └─ SynapseHandlers (ChainScan, HealthCheck)             │
│                                                            │
│  RPC Infrastructure:                                       │
│    ├─ Private dedicated RPC (primary) — per chain         │
│    └─ Public backup RPC — per chain                       │
└────────────────────────────────────────────────────────────┘
```

**Per Relay Miner Node:**
```
┌────────────────────────────────────────────────────────────┐
│  relay-process (Python)                                    │
│    ├─ BittensorClient (axon — serves BidRequest, Execute)  │
│    ├─ ChainAdapterRegistry (destination chain adapters)    │
│    ├─ WalletManager (keys + balances per dst_chain)        │
│    └─ SynapseHandlers (BidRequest, Execute, Standby)       │
│                                                            │
│  Hot Wallets:                                              │
│    └─ Funded address per supported destination chain      │
└────────────────────────────────────────────────────────────┘
```
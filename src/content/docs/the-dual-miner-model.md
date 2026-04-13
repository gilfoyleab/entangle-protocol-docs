# The Dual-Miner Model

Entangle uses Bittensor's **dual incentive mechanism** to run two separate scoring systems on a single subnet. Each mechanism has its own task type, miner population, and emission allocation.

| Mechanism | Name | Emission Share | Miner Role | Task |
|---|---|---|---|---|
| Mechanism 1 | Discovery | 30% | Scanner Miners | Detect `MessageDispatched` events on source chains |
| Mechanism 2 | Relay | 70% | Relay Miners | Execute message delivery to destination chains |

## Scanner Miners

Scanner miners are the event detection layer. They monitor source chain contracts continuously for `MessageDispatched` events and report them to validators.

**How scoring works:**

When a validator broadcasts a `ChainScanSynapse`, scanner miners race to respond with the event data. The validator records its own receipt timestamp miners never self-report timing. Rank-based scoring is applied:

| Detection Rank | Score |
|---|---|
| 1st (fastest) | 1.00 |
| 2nd | 0.70 |
| 3rd | 0.50 |
| 4th | 0.20 |
| Did not respond / wrong data | 0.00 |

**What scanner miners need:**
- Private, low-latency RPC endpoints for each monitored chain (public RPCs create systematic disadvantage)
- Bittensor hotkey + coldkey
- No funded wallets required (read-only operation)
- Low-bandwidth, read-heavy server infrastructure

**Economics:** Scanner miners receive 30% of subnet TAO emissions. Low capital requirements make this role accessible to a broad population intentionally, since the Discovery mechanism benefits from many independent, geographically diverse monitors.

## Relay Miners

Relay miners are the execution layer. They receive verified relay tasks from validators, submit execution transactions on destination chains, and return cryptographic proof of delivery.

**Auction mechanism:**

When validators have a verified `MessageDispatched` event, they open a sealed-bid auction:

```
Validator broadcasts BidRequest
         |
         +-- Relay miners submit bids: { estimated_latency_ms, gas_estimate_usd }
         |
         +-- Validator selects winner (lowest combined score of latency + gas x weight)
         |
         +-- Winner executes relay transaction
         |
         +-- Validator scores execution and updates Bittensor weights
```

**Relay execution flow:**

1. Dedup check if `(src_chain, seq_no, dst_chain)` already in-flight, return cached result
2. Pre-flight checks verify chain support, relay key, and deadline
3. Mark in-flight insert entry before execution
4. Build `PendingMessage` from relay task
5. Execute `adapter.relay_message()` under concurrency semaphore (default: 12 parallel)
6. Map result → `RelayStatus` code
7. Build `ProofBundle` with relay tx and verification data
8. Mark done and cache for future dedup

**Economics:** Relay miners receive 70% of subnet TAO emissions. Higher risk (funded wallets, capital exposure to gas volatility) is compensated by higher rewards. A relay miner consistently winning 10% of relay rounds on a medium-volume network earns significantly more than a top scanner miner.

## Combined Scanner + Relay Miners

A single Bittensor UID can register both roles by declaring `roles: ["scanner", "relay"]` in `HealthCheckSynapse`. This miner participates in both mechanisms and is scored independently on each.

The key advantage: a combined miner that detects an event via its scanner function can pre-position its relay function before the `BidRequest` arrives a meaningful latency advantage in competitive rounds.

> **Note:** Running both roles on a single node adds operational complexity. Scanner and relay functions have different resource profiles and failure modes. Experienced operators may prefer separate UIDs.
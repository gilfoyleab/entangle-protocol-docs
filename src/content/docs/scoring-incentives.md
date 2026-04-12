# Scoring & Incentives

## Discovery Score (Scanner Miners)

A scanner miner's weight is derived from per-event discovery scores averaged across the scoring window (one Bittensor epoch; default 100 blocks):

```
period_discovery_score(miner) = mean(discovery_score_i for all events i)

where events i = all unique (chain_id, seq_no) events in the scoring window
and discovery_score_i ∈ {0.00, 0.20, 0.50, 0.70, 1.00}
```

Miners monitoring more chains observe more events and can score on more of them — incentivising broad chain coverage.

## Execution Score (Relay Miners)

Relay miners are scored across five independent dimensions:

| Dimension | Weight | What It Measures | Score Logic |
|---|---|---|---|
| **SUCCESS** | 50% | Did the relay land on the destination? | 1.0 = confirmed, 0.4 = already relayed, 0.15 = pending, 0.0 = failed |
| **SPEED** | 25% | How fast relative to peers? | relay_block_timestamp − source_block_timestamp (from on-chain headers) |
| **CORRECTNESS** | 15% | Was the proof valid and verifiable? | Multi-RPC quorum query; asymmetric fallback if validator infra fails |
| **FEE_EFFICIENCY** | 5% | Was gas cost reasonable vs the oracle? | Derived from on-chain receipt, NOT miner-reported |
| **RELIABILITY** | 5% | Historical success rate (50-task rolling window) | 0.50 neutral for new miners → graduated baseline |

The final blended score per relay round:

```
winner_score     = 0.80 × execution_score + 0.20 × bid_quality_score
non_winner_score = bid_quality_score (for miners that bid but didn't win)
no_bid           = 0.00
```

## New Relay Miner Reliability Baseline

New miners don't have 50 tasks of history. A graduated baseline prevents impossible first-mover economics:

| Tasks Completed | Reliability Score Applied |
|---|---|
| 0–5 | 0.50 (neutral baseline; no penalty, no bonus) |
| 6–15 | Rolling average of completed tasks only |
| 16–49 | Rolling average, floor of 0.20 |
| 50+ | Full 50-task rolling average, no floor |

## Emission Split

The 30/70 Discovery/Relay emission split is a Bittensor subnet hyperparameter controlled by the subnet owner coldkey (multisig). For every 10 TAO emitted to the subnet: 3 TAO → scanner miner rewards, 7 TAO → relay miner rewards (before Bittensor's standard validator commission).

## Anti-Gaming Protections

**Self-reporting manipulation prevented:** Scanner miner speed rankings use the validator's own receipt timestamp. Miners never submit a timestamp field. The only way to rank higher is to genuinely respond faster.

**Proof fabrication prevented (three-layer correctness check):**
- Layer 1 — Attestation consistency (local): Did the miner include the validator's attestation, unmodified?
- Layer 2 — Destination chain event query (multi-RPC quorum): Did the relay actually land on-chain?
- Layer 3 — Asymmetric fallback: If quorum fails, liveness probe determines whether it's validator infra failure (→ 0.5 neutral) or miner fabrication (→ 0.0)

**ALREADY_RELAYED farming prevented:** Partial credit for ALREADY_RELAYED (208) requires the miner to provide raw signed transaction bytes as proof of genuine attempt. Without this: 0.0.

**Fee self-reporting eliminated:** `fee_paid_usd` is derived entirely from on-chain receipts via Chainlink/Pyth price oracles. Miner-reported values are ignored for scoring.
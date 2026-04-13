# Validators

Validators are the orchestration layer. They do not run chain-scanning infrastructure themselves they outsource scanning to scanner miners and verify results.

## Validator Responsibilities

- Broadcast `ChainScanSynapse` to scanner miners and record receipt timestamps
- Spot-verify events (~20% sampled; all events via multi-reporter consensus)
- Maintain a consensus gas oracle that drives the per-destination fee model
- Sign verified messages with chain-specific attestation keys (cryptographic bridge between Bittensor's sr25519 keys and destination chain signature schemes)
- Run sealed-bid auctions and select relay miner winners
- Independently verify relay execution on destination chains
- Call `set_weights()` on the Bittensor metagraph every epoch (default: every 100 blocks)

## Validator Loop

```
Step 1: Query       ChainScanSynapse → scanner miners
                    Record all receipt timestamps server-side
Step 2: Score       Rank miners by validator receipt time
                    discovery_score ∈ {0.00, 0.20, 0.50, 0.70, 1.00}
Step 3: Auction     BidRequest → relay miners
                    winner selection → execute signal
Step 4: Verify      RelayTask → relay miners
                    Independent on-chain verification of delivery
Step 5: EMA         Exponential Moving Average blends task scores into weights
Step 6: Weights     set_weights() normalises non-zero EMA scores
                    → submits to Bittensor chain
Background:         HealthCheckSynapse every 600s to up to 20 miners
```

## Attestation Model

Validators maintain separate attestation keys for each destination chain ecosystem:

```bash
ENTANGLE_ATTEST_KEY_EVM=0xPRIVKEY       # secp256k1 all EVM chains
ENTANGLE_ATTEST_KEY_SOLANA=BASE58        # ed25519 Solana
ENTANGLE_ATTEST_KEY_SUI=BASE58           # ed25519 SUI
ENTANGLE_ATTEST_KEY_COSMOS=0x...         # secp256k1 Cosmos chains
ENTANGLE_ATTEST_KEY_STELLAR=BASE58       # ed25519 Stellar
```

Keys are loaded into memory at startup and never written to disk. Use an HSM or encrypted secrets manager (AWS Secrets Manager, HashiCorp Vault).
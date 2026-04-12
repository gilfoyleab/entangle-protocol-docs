# How It Works — System Overview

Every cross-chain message passes through the same three-phase lifecycle:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ENTANGLE MESSAGE LIFECYCLE                       │
├──────────────┬────────────────────────────┬────────────────────────┤
│   PHASE 1    │         PHASE 2            │        PHASE 3         │
│    SCAN      │          AUCTION           │         RELAY          │
│              │                            │                        │
│  Scanner     │  Validators verify events, │  Winning relay miner   │
│  miners      │  collect threshold         │  executes delivery on  │
│  watch source│  attestations, and run     │  destination chain     │
│  chains for  │  sealed-bid relay auction: │  using validator-issued │
│  events      │  selecting winner by       │  threshold signature   │
│              │  latency, gas, history     │  bundle                │
│              │                            │                        │
│  ← 30% TAO → │       Orchestration        │   ← 70% TAO ←         │
└──────────────┴────────────────────────────┴────────────────────────┘
```

## The Message Lifecycle — Step by Step

**Step 1 — dApp Sends**  
A dApp calls `sendMessage()` on the Entangle contract. Fee is split into a platform fee and relay reserve.

**Step 2 — Scanners Detect**  
Scanner miners race to detect the `MessageDispatched` event via private RPC. The first verified response earns the highest score.

**Step 3 — Validators Sign**  
Validators spot-verify events, serialise canonical message fields, and produce a threshold signature bundle using chain-specific attestation keys.

**Step 4 — Relay Delivers**  
The winning relay miner from the sealed-bid auction calls `receiveEntangleMessage()` on the destination dApp.

## Network Topology

```
                   BITTENSOR METAGRAPH
                   (subnet registration,
                    UID assignments,
                    weight aggregation)
                          │
           ┌──────────────┼──────────────┐
           │              │              │
      ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
      │  VAL-1  │    │  VAL-2  │    │  VAL-N  │
      └────┬────┘    └────┬────┘    └────┬────┘
           │              │              │
           └──────┬────────┘──────┬──────┘
                  │               │
        ┌─────────┴──┐     ┌──────┴──────────┐
        │ SCANNER     │     │  RELAY          │
        │ MINERS      │     │  MINERS         │
        │ (M1 pool)   │     │  (M2 pool)      │
        └──────┬──────┘     └──────┬──────────┘
               │                   │
   ┌───────────┴──────┐    ┌───────┴──────────────┐
   │  SOURCE CHAINS   │    │  DESTINATION CHAINS  │
   │ • ETH mainnet    │    │ • Arbitrum           │
   │ • Solana         │    │ • Optimism           │
   │ • Cosmos Hub     │    │ • SUI                │
   │ • SUI            │    │ • Stellar            │
   │ • Stellar        │    │ • ETH mainnet        │
   └──────────────────┘    └──────────────────────┘
        (Entangle contracts deployed on all chains)
```
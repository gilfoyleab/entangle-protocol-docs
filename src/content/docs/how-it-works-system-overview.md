# How It Works System Overview

Every cross-chain message passes through the same three-phase lifecycle:

| Phase 1 Scan | Phase 2 Auction | Phase 3 Relay |
|---|---|---|
| Scanner miners watch source chains for `MessageDispatched` events | Validators verify events, collect threshold attestations, and run sealed-bid relay auction: selecting winner by latency, gas, history | Winning relay miner executes delivery on destination chain using validator-issued threshold signature bundle |
| **30% TAO** | Orchestration | **70% TAO** |

## The Message Lifecycle Step by Step

**Step 1 dApp Sends**  
A dApp calls `sendMessage()` on the Entangle contract. Fee is split into a platform fee and relay reserve.

**Step 2 Scanners Detect**  
Scanner miners race to detect the `MessageDispatched` event via private RPC. The first verified response earns the highest score.

**Step 3 Validators Sign**  
Validators spot-verify events, serialise canonical message fields, and produce a threshold signature bundle using chain-specific attestation keys.

**Step 4 Relay Delivers**  
The winning relay miner from the sealed-bid auction calls `receiveEntangleMessage()` on the destination dApp.

## Network Topology

```
                   BITTENSOR METAGRAPH
                   (subnet registration,
                    UID assignments,
                    weight aggregation)
                          |
           +--------------+--------------+
           |              |              |
        VAL-1          VAL-2          VAL-N
           |              |              |
           +------+-------+------+------+
                  |              |
          SCANNER MINERS    RELAY MINERS
           (M1 pool)        (M2 pool)
                  |              |
   +--------------+    +---------+-----------+
   | SOURCE CHAINS|    | DESTINATION CHAINS  |
   | - ETH mainnet|    | - Arbitrum          |
   | - Solana     |    | - Optimism          |
   | - Cosmos Hub |    | - SUI               |
   | - SUI        |    | - Stellar           |
   | - Stellar    |    | - ETH mainnet       |
   +--------------+    +---------------------+

        (Entangle contracts deployed on all chains)
```
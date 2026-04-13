# Glossary

| Term | Definition |
|---|---|
| **Alpha** | Entangle's subnet token on Bittensor. A work/utility token. |
| **Bittensor** | Decentralised AI network providing the incentive and consensus layer for Entangle |
| **ChainAdapter** | A Python class implementing chain-specific logic for one blockchain ecosystem |
| **ChainScanSynapse** | The synapse type sent by validators to scanner miners to request event detection |
| **Discovery Mechanism** | Mechanism 1 30% emission, runs scanner miner scoring |
| **HealthCheckSynapse** | Fast liveness probe sent by validators every ~10 minutes to all miners |
| **Metagraph** | Bittensor's on-chain registry of subnet participants and their weights |
| **MessageDispatched** | The on-chain event emitted by the Entangle contract when a dApp sends a message |
| **MessageEnvelope** | Chain-agnostic canonical data structure describing a pending cross-chain message |
| **ProofBundle** | Cryptographic evidence of delivery returned by a relay miner |
| **Relay Mechanism** | Mechanism 2 70% emission, runs relay miner scoring |
| **RelayTask** | The primary synapse type carrying message context from validator to miner |
| **Scanner Miner** | Miner role that monitors source chains for MessageDispatched events (Mechanism 1) |
| **Relay Miner** | Miner role that executes message delivery to destination chains (Mechanism 2) |
| **Sealed-Bid Auction** | The validator-run process for selecting which relay miner executes each message |
| **TAO** | Bittensor's native token; emitted to subnet participants proportional to performance |
| **Threshold Attestation** | Cryptographic mechanism requiring >60% of registered validator stake to attest before message execution |
| **Yuma Consensus** | Bittensor's consensus mechanism aggregating validator weights to produce TAO emission distribution |
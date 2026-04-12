# Running a Miner

## Prerequisites

- Python 3.10+
- Bittensor wallet (hotkey + coldkey)
- TAO for registration burn
- For relay miners: funded wallets on all supported destination chains

## Scanner Miner Setup

**Step 1: Configure environment variables**

```bash
# Chains to monitor (comma-separated chain IDs from the on-chain registry)
ENTANGLE_SCANNER_CHAINS=ethereum_mainnet,solana_mainnet,cosmos_mainnet

# RPC endpoint per monitored chain (private/dedicated strongly recommended)
ENTANGLE_SCANNER_RPC_ETHEREUM_MAINNET=https://your-private-eth-rpc.com
ENTANGLE_SCANNER_RPC_SOLANA_MAINNET=https://your-private-sol-rpc.com
ENTANGLE_SCANNER_RPC_COSMOS_MAINNET=https://your-private-cosmos-rpc.com

# Bittensor credentials
ENTANGLE_BITTENSOR_HOTKEY=your_hotkey
ENTANGLE_BITTENSOR_COLDKEY=your_coldkey

# Role declaration
ENTANGLE_SCANNER_ROLE_DECLARATION=scanner
```

**Step 2: Register on the subnet**

```bash
btcli subnet register --netuid <entangle_subnet_id>
```

**Step 3: Start the scanner**

```bash
python neurons/miner.py --relay.chains ethereum_mainnet,solana_mainnet
```

> **RPC Quality is Critical:** A scanner miner competing on validator receipt time with a shared public RPC will systematically lose to operators with private, low-latency infrastructure.

## Relay Miner Setup

**Step 1: Configure environment variables**

For each chain you support:

```bash
# RPC endpoint
ENTANGLE_PROTOCOL_RPC_ETHEREUM=https://eth.llamarpc.com

# Private key (relay execution wallet — must be funded)
ENTANGLE_PROTOCOL_KEY_ETHEREUM=0x<private_key_hex>

# Entangle ProtocolHub contract address
ENTANGLE_PROTOCOL_CONTRACT_ETHEREUM=0x<ProtocolHub_deployed_address>
```

Repeat for each chain: `SOLANA`, `SUI`, `STELLAR`, `COSMOSHUB`, `ARBITRUM`, `BASE`, `POLYGON`, `OPTIMISM`, etc.

**Step 2: Configuration flags**

```bash
--relay.max_fee_usd 10           # Maximum USD gas per relay (default $10)
--relay.max_concurrent 12        # Parallel relay executions (default 12)
--relay.deadline_buffer_secs 20  # Reject tasks with <20s to deadline
--relay.chains ethereum,arbitrum # Explicit list of supported chains
```

**Step 3: Start the relay miner**

```bash
python neurons/miner.py --relay.chains ethereum,arbitrum,solana
```

## Miner Type Declaration (HealthCheckSynapse)

Validators poll miners every ~10 minutes via `HealthCheckSynapse`. Declare your role in the response:

```json
// Scanner-only
{ "version":"1.2.0", "roles":["scanner"], "supported_chains":["ethereum_mainnet","solana_mainnet"] }

// Relay-only
{ "version":"1.2.0", "roles":["relay"], "dst_chains":["ethereum_mainnet","arbitrum"] }

// Combined
{ "version":"1.2.0", "roles":["scanner","relay"], "supported_chains":["ethereum_mainnet"], "dst_chains":["arbitrum"] }
```

Miners that don't respond within 60 seconds are excluded from all scoring rounds until the next successful check.

## Private MEV Protection for Relay Miners

When submitting EVM relay transactions, use private mempool routing to prevent MEV front-running:

| Chain | Recommended Private RPC |
|---|---|
| Ethereum | Flashbots Protect (`https://rpc.flashbots.net`) or MEV Blocker (`https://rpc.mevblocker.io`) |
| Polygon | Polygon Blocknative private mempool |
| Arbitrum / Optimism / Base | Standard submission (sequencer-ordered; private RPC recommended as best practice) |
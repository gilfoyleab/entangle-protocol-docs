# Supported Chains & Ecosystem Adapters

## Launch Chain Support

| Chain | Ecosystem | Finality Model | Confirmation Blocks | Signature Scheme |
|---|---|---|---|---|
| Ethereum mainnet | EVM | Probabilistic (PoS) | 2 (safe head); 32 for epoch finality | secp256k1 |
| Arbitrum One | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Base | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Optimism | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Polygon | EVM PoA | Checkpoint | 64 | secp256k1 |
| BNB Chain | EVM PoA | Checkpoint | 64 | secp256k1 |
| Avalanche | EVM (Snowman) | Instant after acceptance | 1 | secp256k1 |
| Solana mainnet | Solana | Tower BFT | 32 slots (~13s) | ed25519 |
| SUI mainnet | SUI | Narwhal/Bullshark | 1 checkpoint | ed25519 |
| Cosmos Hub | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Osmosis | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Neutron | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Stellar mainnet | Stellar | SCP (federated) | 1 ledger close | ed25519 |

**Phase 2 additions:** SUI (additional), Cosmos Hub, Osmosis, Neutron  
**Phase 3 additions:** Stellar, additional Cosmos chains

## Finality Confirmation Depths (constants.py)

```python
FINALITY_BLOCKS: dict[str, int] = {
    'ethereum':   12,   # ~2.5 min; PoS single-slot final at 2 epochs
    'arbitrum':    1,   'optimism':  1,   'base': 1,
    'polygon':    64,   'bsc':      64,
    'avalanche':   1,   # Snowman: instant after acceptance
    'solana':      1,   # Confirmed commitment level
    'sui':         1,   'stellar': 1,
    'cosmoshub':   1,   'osmosis': 1,   'neutron': 1,
}
```

## ChainAdapter Interface

All adapters implement the same abstract interface the only component containing ecosystem-specific code:

```python
class ChainAdapter(ABC):
    @abstractmethod
    def get_pending_messages(self, from_height, to_height) -> list[PendingMessage]: ...

    @abstractmethod
    def is_message_delivered(self, seq_no, src_chain) -> bool: ...

    @abstractmethod
    def relay_message(self, msg, private_key, max_fee_usd) -> RelayResult: ...

    @abstractmethod
    def verify_relay(self, relay_tx, expected_seq) -> tuple[bool, raw_proof_dict]: ...

    @abstractmethod
    def get_rpc_latency_ms(self) -> float: ...

    @abstractmethod
    def get_wallet_info(self, private_key) -> WalletInfo: ...

    @abstractmethod
    def get_current_height(self) -> int: ...
```

**Ecosystem-specific implementations:**

- **EVMAdapter** handles all 7 EVM chains via web3.py. PoA chains (Polygon, BNB) get `ExtraDataToPOAMiddleware` injected automatically.
- **SolanaAdapter** uses solana-py and the Anchor IDL. Parses base64-encoded Anchor events using discriminators.
- **SUIAdapter** uses SUI JSON-RPC API via aiohttp. Object-centric execution via programmable transaction blocks.
- **StellarAdapter** split architecture: base ledger via Horizon REST API, smart contracts via Soroban RPC.
- **CosmosAdapter** uses Cosmos REST API (Stargate) and CosmWasm execution. Handles per-chain denom differences.
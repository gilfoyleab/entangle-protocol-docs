# Smart Contracts

## One Contract Per Chain

Entangle deploys **one contract per supported blockchain**. A single deployment serves both directions:

- **Source-side**: When a dApp calls `sendMessage()`, the contract collects fees and emits `MessageDispatched`
- **Destination-side**: When a relay miner delivers a message, it calls the dApp's `receiveEntangleMessage()`, which calls back into the Entangle contract's `verifyMessage()` to validate the threshold signature bundle

## Core Contract Functions

| Function | Visibility | Caller | Description |
|---|---|---|---|
| `sendMessage(dst_chain, dst_addr, payload)` | external payable | Any dApp | Accepts fee, validates invariant, emits `MessageDispatched`, increments `seq_no` |
| `verifyMessage(msg_hash, sig_bundle)` | external view | Destination dApp | Verifies threshold signature bundle against registered validator set. Returns `bool`. |
| `updateGasOracle(dst_chain, gas_estimate)` | external | Registered validator | Submits gas cost estimate; contract computes stake-weighted median |
| `setBaseFee(dst_chain, amount)` | external | Protocol multisig | Sets platform base fee for a destination chain |
| `setGasBuffer(dst_chain, multiplier)` | external | Protocol multisig | Sets gas reserve safety multiplier |
| `setFeeSplit(dst_chain, platform_bps)` | external | Protocol multisig | Sets platform_fee / relay_reserve ratio |
| `updateValidatorSet(validators[], weights[])` | external | Protocol multisig (timelocked) | Replaces registered validator public keys and stake weights |
| `setSignatureThreshold(threshold)` | external | Protocol multisig (timelocked) | Sets minimum validator signatures for `verifyMessage()` to pass |
| `freezeOracle(dst_chain, value)` | external | Protocol multisig | Emergency freeze of gas oracle at a manual value |
| `withdrawRelayReserve(dst_chain, amount)` | external | Protocol multisig | Withdraws accumulated relay reserve |
| `getTotalFee(dst_chain)` | view | Anyone | Returns current total fee helper for dApp UIs |
| `getSeqNo(src_addr, dst_chain)` | view | Anyone | Returns next sequence number for a sender/destination pair |

## Contract Events

```solidity
MessageDispatched(
    uint64 indexed seq_no,
    address indexed src_addr,
    string dst_chain,
    string dst_addr,
    bytes payload
)

MessageExecuted(
    uint64 indexed seq_no,
    address indexed relayer,   // winning miner's relay address
    address recipient,
    bytes32 payload_hash
)

GasOracleUpdated(string dst_chain, uint256 new_reserve, uint256 validator_count)
ValidatorSetUpdated(address[] validators, uint256[] weights, uint256 threshold)
FeeSplitUpdated(string dst_chain, uint256 platform_bps)
RelayReserveWithdrawn(string dst_chain, uint256 amount, address recipient)
```

## Fee Invariant

The contract enforces this invariant at every `sendMessage()` call:

```solidity
require(msg.value >= platform_base_fee[dst_chain] + gas_reserve[dst_chain])
// gas_reserve[dst_chain] = oracle_median × gas_buffer_multiplier
```

If the gas oracle hasn't updated recently and gas prices spike above the reserve, `sendMessage()` reverts with `InsufficientReserve` until the oracle catches up. dApps should call `getTotalFee(dst_chain)` before presenting a relay UI to users.

## Cross-Chain Replay Protection 4-Tuple Dedup Key

To prevent a message intended for one destination from being executed on another, all dedup keys use a 4-tuple:

| Layer | Key |
|---|---|
| EVM contract | `keccak256(abi.encode(src_chain, DST_CHAIN_NAME, seq_no))` |
| Solana PDA | `[b"executed", src_chain_hash[:8], dst_chain_hash[:8], seq_le_bytes]` |
| SUI Move | `ExecutionKey { src_chain: String, dst_chain: String, seq_no: u64 }` |
| Cosmos | `EXECUTED map key: (src_chain, dst_chain, seq_no)` |
| Stellar | `DataKey::Executed wraps (src_chain_hash, dst_chain_hash, seq_no)` |
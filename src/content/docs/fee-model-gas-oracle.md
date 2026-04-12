# Fee Model & Gas Oracle

## Fee Architecture

Every cross-chain message triggers a fee payment split at the source chain contract:

```
sendMessage(dst_chain, dst_addr, payload) payable:
  total_fee = platform_base_fee[dst_chain] + gas_reserve[dst_chain]
  require(msg.value >= total_fee)

  platform_fee     → protocol_treasury_address (e.g. 20% of total_fee)
  relay_reserve    → relay_reserve_pool[dst_chain]
  emit MessageDispatched(...)
```

## Gas Oracle

The gas oracle dynamically adjusts `gas_reserve[dst_chain]` to match actual destination chain gas costs. Validators maintain the oracle via consensus:

```
Oracle update cycle (per validator, every ~10 blocks / ~2 minutes):
  1. Validator samples current gas price on dst_chain via RPC
  2. Estimates gas cost of a typical receiveEntangleMessage() call
  3. Submits updateGasOracle(dst_chain, gas_cost_estimate) on-chain
  4. Contract accepts if caller is a registered validator
  5. Contract computes stake-weighted median of recent submissions
  6. Updates gas_reserve[dst_chain] = median × gas_buffer_multiplier

  gas_buffer_multiplier default: 1.25 (25% safety margin above median)
```

**Oracle Collusion Circuit Breaker:** The contract rejects any gas oracle update that deviates more than 30% from the previous epoch's accepted value, unless countersigned by the protocol multisig.

## Fee-to-Quality Flywheel

```
High relay volume
  → More platform fees and relay reserves collected
  → Larger treasury for protocol sustainability
  → Relay miners can support more chains and higher volumes
  → Better miners attracted → lower latency, lower fees
  → More dApps integrate → higher relay volume
  → (repeat)
```
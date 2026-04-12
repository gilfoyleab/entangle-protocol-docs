# dApp Integration Guide

## How Delivery Works

When a relay miner wins an auction for a cross-chain message, it calls `receiveEntangleMessage()` on the **destination dApp contract** — not the Entangle contract. The dApp owns this function and implements its own application logic inside it.

```
Relay miner
  → dApp.receiveEntangleMessage(payload, seq_no, src_chain, src_addr, sig_bundle)

Inside dApp.receiveEntangleMessage():
  1. Check dedup:  require(!executed[seq_no], 'ALREADY_EXECUTED')
  2. Build hash:   msg_hash = hash(src_chain, dst_chain, seq_no, src_addr, dst_addr, payload)
  3. Validate:     require(entangle.verifyMessage(msg_hash, sig_bundle))
  4. Mark done:    executed[seq_no] = true
  5. App logic:    _handleMessage(payload)   // your custom logic here
```

## EVM Integration (Solidity)

**Step 1: Import the Entangle interface**

```solidity
// SPDX-License-Identifier: MIT
interface IEntangle {
    function verifyMessage(bytes32 msgHash, bytes calldata sigBundle)
        external view returns (bool);
}
```

**Step 2: Implement your dApp contract**

```solidity
contract MyDApp {
    IEntangle public immutable entangle;
    mapping(uint64 => bool) public executed;

    constructor(address _entangle) {
        entangle = IEntangle(_entangle);
    }

    // Source: send a message to another chain
    function sendCrossChainMessage(
        string calldata dst_chain,
        address dst_addr,
        bytes calldata payload
    ) external payable {
        uint256 fee = IEntangle(address(entangle)).getTotalFee(dst_chain);
        require(msg.value >= fee, "INSUFFICIENT_FEE");
        IEntangle(address(entangle)).sendMessage{value: fee}(
            dst_chain, dst_addr, payload
        );
    }

    // Destination: receive a message from another chain
    function receiveEntangleMessage(
        bytes calldata payload,
        uint64 seq_no,
        string calldata src_chain,
        bytes calldata src_addr,
        bytes calldata sig_bundle
    ) external {
        require(!executed[seq_no], 'ALREADY_EXECUTED');

        bytes32 msg_hash = keccak256(abi.encode(
            src_chain, block.chainid, seq_no, src_addr,
            address(this), payload
        ));

        require(entangle.verifyMessage(msg_hash, sig_bundle), 'BAD_SIGS');
        executed[seq_no] = true;
        _handleMessage(payload); // implement your logic here
    }

    function _handleMessage(bytes calldata payload) internal {
        // your application logic
    }
}
```

**Step 3: Query the current fee before sending**

Always call `getTotalFee(dst_chain)` before presenting a send UI — fees change with the gas oracle:

```javascript
const fee = await entangle.getTotalFee("arbitrum");
await myDApp.sendCrossChainMessage("arbitrum", recipientAddr, payload, { value: fee });
```

## Integration Summary by Ecosystem

| Ecosystem | Relay miner calls | dApp calls for validation | Sig scheme |
|---|---|---|---|
| EVM (Ethereum, Arbitrum…) | `dApp.receiveEntangleMessage()` | `entangle.verifyMessage()` | secp256k1 ECDSA |
| Solana | `receiveEntangleMessage` instruction | Entangle program `verify_message` CPI | ed25519 |
| SUI | dApp Move function `receiveEntangleMessage` | Entangle Move `verify_message` call | ed25519 |
| Cosmos / IBC | dApp CosmWasm `receiveEntangleMessage` | Entangle CosmWasm `verify_message` | secp256k1 ECDSA |
| Stellar | dApp contract `receiveEntangleMessage` | Entangle contract `verify_message` | ed25519 |

## Adding New Chains

**Same-ecosystem chain (e.g., a new EVM L2):** Deploy the Entangle contract and add to the Chain Configuration Registry. No code changes required.

**New ecosystem chain:** Requires a new `ChainAdapter` implementation, an SDK PR, and a governance vote to add it to the chain registry.
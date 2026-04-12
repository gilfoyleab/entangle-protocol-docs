# Security Model

## Threshold Attestation

All message delivery is gated by a **threshold signature bundle** — validators must collectively attest to a message before it can be executed on the destination chain. Compromising the attestation requires controlling >60% of registered validator stake — the same threshold needed to corrupt Bittensor consensus itself.

**EVM (Solidity):**
```solidity
function executeMessage(
    string calldata src_chain,
    uint64 seq_no,
    address dst_recipient,
    bytes calldata payload,
    AttestationBundle calldata bundle
) external nonReentrant {
    // 1. Verify dedup (4-tuple)
    bytes32 key = _execKey(src_chain, DST_CHAIN_NAME, seq_no);
    require(!_executed[key], 'AlreadyExecuted');

    // 2. Verify attestation bundle — BEFORE any state change
    bytes32 payload_hash = keccak256(payload);
    uint128 attestedStake = 0;
    for (uint i = 0; i < bundle.validator_uids.length; i++) {
        ValidatorRecord memory v = validators[bundle.validator_uids[i]];
        require(v.active, 'InactiveValidator');
        require(bundle.payload_hashes[i] == payload_hash, 'PayloadMismatch');
        require(bundle.dst_recipients[i] == dst_recipient, 'RecipientMismatch');
        // Verify signature from validator's registered chain key
        bytes32 digest = _attestDigest(src_chain, seq_no, DST_CHAIN_NAME, payload_hash, dst_recipient);
        require(_recoverSigner(digest, bundle.signatures[i]) == v.signingKey, 'InvalidSig');
        attestedStake += v.stakeWeight;
    }
    uint128 required = totalRegisteredStake * THRESHOLD_PERCENT / 100;
    require(attestedStake >= required, 'BelowStakeThreshold');

    // 3. Mark executed and run payload — AFTER threshold verified
    _executed[key] = true;
    emit MessageExecuted(seq_no, msg.sender, dst_recipient);
    (bool ok,) = dst_recipient.call{gas:100_000}(payload);
}
```

## Security Properties

**Payload integrity:** The contract hashes the submitted payload and requires validators' signed commitments to match. The miner cannot substitute payload without all attesting validators having signed a different hash.

**Recipient integrity:** `dst_recipient` is explicitly covered in the attestation digest. Substituting it invalidates every validator's signature simultaneously.

**Pre-execution enforcement:** The stake threshold check is the first gating operation in `executeMessage()`. Nothing executes until it passes.

**No new trust set:** Bittensor validators are already economically incentivised to attest honestly via TAO staking. A colluding validator loses stake through slashing and reputation.

## Source Chain Reorg Protection

Validators do not advance their block cursor to the chain tip immediately. They respect per-chain finality depths before attesting:

```python
current_height = await adapter.get_current_height()
safe_height    = current_height - FINALITY_BLOCKS[chain]
# Validator does NOT attest to events above safe_height
msgs = await adapter.get_pending_messages(from_height=self.cursors[chain], to_height=safe_height)
self.cursors[chain] = safe_height
```

## Cross-Validator Collusion Detection

Validators gossip score vectors to each other via `ScoreGossip` synapse after each epoch. Because most scores are deterministic from on-chain data, a validator whose submitted weights deviate significantly from the stake-weighted median is producing provably wrong scores:

```python
def _detect_collusion(self, gossip_pool, uid):
    scores = {g.validator_uid: g.score_vec for g in gossip_pool if g.miner_uid == uid}
    median_vec = stake_weighted_median(scores, self.metagraph.S)
    for vuid, vec in scores.items():
        deviation = mean_absolute_error(vec, median_vec)
        if deviation > 0.15:   # >15% mean deviation from median
            self._flag_validator(vuid, deviation)
            # Flagged validators' weight contributions are discounted
```
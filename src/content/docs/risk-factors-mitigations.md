# Risk Factors & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| All scanner miners go offline simultaneously | Critical — relay pipeline stalls | Emergency validator fallback scanner activates after ~90s. Economic incentives (zero score = zero emission) strongly disfavour downtime. |
| Scanner miners gaming the speed ranking | Medium — unfair emission distribution | Validator uses its own receipt timestamp — miners never submit timing. Fabricated event data scores 0.00. |
| Validator oracle collusion (majority stake suppresses gas reserve) | High — relay miners underfunded | Circuit breaker rejects oracle updates deviating >30% from prior epoch. Multisig can freeze oracle. All submissions publicly auditable. |
| Gas price spike on EVM destination chains | Medium — relay miners temporarily underfunded | 1.25× gas buffer. Oracle updates every ~2 minutes. Multisig can manually set gas reserve via `freezeOracle()`. |
| Scanner miner fabricated event reports | Medium — false events enter relay pipeline | Validator spot-verifies ~20% sampled. Fabricated reports score 0.00. Three flags trigger 24h suspension. |
| Attestation key compromise | High — attacker can sign arbitrary messages | Keys in HSM/encrypted secrets manager. Single compromised key cannot meet threshold alone. Emergency `updateValidatorSet()` call. |
| Smart contract vulnerability | High — loss of relay reserve or platform fees | Formal audit before mainnet. Threshold signature limits blast radius. Bug bounty ($500K cap). Circuit breaker: auto-pause above threshold loss. |
| TAO price dependency | High — scanner miner income collapses in bear market | Emergency burn rate (up to 50%). Insurance Fund subsidises scanner ops during downturns. Relay miners paid in ETH/BNB/MATIC directly. |
| Relay miner cartel | Medium — price-gouging | Maximum bid cap. Fallback relay pool if no valid bid within 15 blocks. Slashing for detected bid collusion. |
| Bittensor protocol changes | Low — architecture dependency | Protocol versioning; fallback single-mechanism design available. Architecture follows official Bittensor multi-mechanism specification. |
# Tokenomics & Economics

## The Alpha Token

Alpha is Entangle's subnet token on Bittensor. It is a **work token** (utility token) not a profit-sharing security. Alpha holders benefit from two demand drivers:

1. **TAO emissions:** Bittensor emits TAO to the subnet, which converts to Alpha via the subnet's internal AMM
2. **Fee buyback:** Protocol fee revenue is used to buy Alpha on the open market (programmatic demand backed by real revenue)

## Revenue Buyback Mechanism

```
Step 1  dApp relays a message $0.08 fee paid in ETH
Step 2  Relay confirmed → 70% to winning relay miner ($0.056)
Step 3  30% → Treasury ($0.024 per message)
Step 4  20% of treasury → TWAP buyback of Alpha via DEX (every 7 days)
Step 5  Bought Alpha is burned or locked in governance staking pool
```

**Monthly Buyback Formula:**
```
MonthlyBuybackUSD = DailyMessages × ProtocolFee × 0.20 × 30

Y1 baseline (50K msgs/day, $0.08/msg):
  MonthlyBuybackUSD = 50,000 × $0.08 × 0.20 × 30 = $24,000/month

Y3 scale (3M msgs/day):
  MonthlyBuybackUSD = 3,000,000 × $0.05 × 0.20 × 30 = $900,000/month
```

## Supply Dynamics Over Time

| Period | Daily Msgs | Monthly Emission (α) | Monthly Buyback (α) | Burn (20% rate) | Net Supply Change |
|---|---|---|---|---|---|
| Month 1 | 5,000 | 937,500 | 10,667 | 187,500 | +739,333 (High inflation) |
| Month 6 | 30,000 | 937,500 | 64,000 | 187,500 | +686,000 (Moderate) |
| Month 12 | 50,000 | 937,500 | 106,667 | 187,500 | +643,333 (Controlled) |
| Month 24 | 500,000 | 937,500 | 1,066,667 | 187,500 | -316,667 (**Net deflationary**) |
| Month 36 | 3,000,000 | 937,500 | 6,000,000 | 187,500 | -5,250,000 (Strongly deflationary) |

> **Deflationary Inflection Point:** At ~500,000 messages/day, buyback alone exceeds new Alpha emission. Combined with burn rate, the protocol becomes structurally deflationary.

## Emission Burn Rate

The protocol can vote to burn a percentage of miner emission before it reaches miners a deflationary lever:

| Burn Rate | Net Emission/Day | Burned α/Day | When to Use |
|---|---|---|---|
| 0% (Off) | 31,250 α | 0 | Bootstrap phase |
| 10% | 28,125 α | 3,125 | Early operation |
| **20% (Recommended)** | **25,000 α** | **6,250** | **Steady state** |
| 35% | 20,313 α | 10,937 | Bear market defence |
| 50% (Max) | 15,625 α | 15,625 | Emergency defence |

## Miner Economics at Scale

**Relay Miner earnings (40 relay miners, 70% emission pool):**

| Daily Msgs | Monthly Fee Revenue | Relay Pool (70%) | Per Miner/Month | Infrastructure | Monthly Profit |
|---|---|---|---|---|---|
| 5,000 (Bear) | $400 | $280 | $7 / $210 | $400 | **-$190 (loss)** |
| 15,000 (Low) | $1,200 | $840 | $630 | $400 | **+$230** |
| 50,000 (Y1 baseline) | $4,000 | $2,800 | $2,100 | $400 | **+$1,700** |
| 500,000 (Y2 growth) | $30,000 | $21,000 | $5,250 | $400 | **+$4,850** |
| 3,000,000 (Y3 scale) | $150,000 | $105,000 | $26,250 | $400 | **+$25,850** |

*Avg fee = $0.08/msg. Top relay miners win more bids (competitive bidding) and earn 2–5× average.*

## Protocol Self-Sustainability

```
Break-even analysis (TAO-independent, fee revenue only):

  Scanner operational cost:  60 miners × $500/month = $30,000/month
  Validator operational cost: 12 validators × $1,200/month = $14,400/month
  Total op cost:              $44,400/month

  Treasury receives 30% of fees:
  Break-even fee revenue:    $44,400 / 0.30 = $148,000/month
  Break-even messages:       ~62,000 msgs/day

  With TAO emission (normal case): ~15,000 msgs/day
```

The Y1 baseline target of 50K/day means the protocol approaches fee-only sustainability by Month 3–4.

## The Dual Flywheel

```
TAO Demand → more TAO staked in subnet → Alpha price rises
Fee Buyback → market buy pressure → Alpha price rises

NetAlphaDemand = TAO_stake_demand + Fee_buyback_demand
NetAlphaSupply = Emission × (1-B) - Buyback_burns

AlphaEquilibriumP = NetAlphaDemand / NetAlphaSupply
```

Most Bittensor subnets rely entirely on TAO emission for miner incentives. If TAO price drops, the entire subnet degrades. Entangle breaks this dependency with a second demand source protocol fee buybacks in stable USD-denominated value. Relay miners are paid in ETH/BNB/MATIC directly, and Alpha buyback continues in real dollar terms even in a TAO bear market.
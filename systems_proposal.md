# Coop Co — Systems Proposal: Contracts, Balance, Achievements, Eggspeditions & the Enlightenment Egg

**Version:** Draft 1.0 (design proposal — no code changes)
**Source basis:** `CODE_REVIEW_REPORT.md` (2026-09-22) and direct review of `Scripts/*.js`
**Status:** Proposal / discussion document for the v3.0 rewrite (Phase 3–5)

---

## 0. Design Principles for This Proposal

Every proposal below follows five rules, derived directly from the problems found in the review:

1. **Kill multiplicative on top of multiplicative.** The game's inflation is not one bug — it is a *stack of universal multipliers* ($\text{boost}_A \times \text{boost}_B \times \text{boost}_C$) stacked on already-compounding base values. Proposals cap, separate, or convert these.
2. **Goals must not scale with the player's own power.** Contracts scale goal *and* reward with `soulEggBoost` (`contracts.js:112-113`) — they never get harder, only richer. Bounded difficulty is introduced instead.
3. **Every currency must be spendable or capped.** Soul Eggs are spent, Knowleggs are spent; **Prophecy Eggs are never spent** (`contracts.js:146`, `prestige.js:12`) — they only inflate. This is the #1 economy bug.
4. **Choice is content.** Monotony ("same button, deeper number") is fought by giving the player *decisions with trade-offs* at each system.
5. **The final egg must be a phase, not a penalty.** Enlightenment should be the best *place to be* at endgame, not the worst.

---

## 1. Contracts System — Complete Redesign

### 1.1 What's wrong today (from the review)

| Problem | Evidence |
|---|---|
| Monotonous | 9 fixed contracts, 3 slots, always one active. No choice beyond "which of 3". |
| Overpowered | Reward formula `reward = log(baseGoal,3)·√contractsCompleted·(1+log₂(goalBoost))` (`contracts.js:111-114`) — reward grows with *total completions* and *current prophecy count*, compounding forever. |
| Self-scaling | `goal = baseGoal·eggValue·contractGoalBoost·soulEggBoost` (`contracts.js:112`). Goal tracks your soul boost exactly, so contracts are always trivially completable. |
| No spend sink | Prophecy Eggs never leave your account → `1.015^prophecy` boost (`prestige.js:12`) inflates Soul Egg gain without end (softcap only kicks in at 1e6). |
| Buggy UX | Start/exit states fight each other (`contracts.js:81-88`, `119-141`); exit doesn't reset the same fields prestige does (see review §2.10). |
| Forced reset | Starting a contract force-prestiges (`contracts.js:122`) with no opt-out — feels punitive. |

### 1.2 The redesign: **"The Coop Exchange" — a market, not a chore**

Contracts become a **contract market** with three structural changes:

1. **Prophecy Eggs become a spendable currency** (economy fix, see §2.3).
2. **Contracts no longer scale with player power** — difficulty, not reward, is what grows.
3. **Contract variety comes from modifiers, not just "which egg".**

#### 1.2.1 A. Contract Deck & Offerings
- Replace the single `prestigeContracts` array with a **deck of ~24 typed contracts**, generated on a refresh cycle. Each refresh offers **4 contracts** from types:
  - **Delivery** (reach a money threshold on a given egg) — the legacy form.
  - **Order** (reach a threshold *while a modifier is active*: "-50% Chicken Gain", "no Epic Research", "0.1× Lay Rate"). Modifiers are the *choice*.
  - **Marathon** (sustain a ranked output over N real-time minutes, shown as a progress bar) — adds a time dimension, breaks the "instantly complete" monotony.
  - **Expedition** (complete a target planet's first objectives; see §4) — cross-links Eggspeditions.
  - **Challenge** (hard modifier stack, e.g. "Lay Rate ×0.1 **and** Research ×1.35 cost **and** no offline progress") with 5–10× the reward.
- **No forced prestige:** a contract has a configurable "Run" that *pre-loads* you onto the contract's egg at your current prestige state, and warns you it will reset research, chickens and money. The player *chooses* a normal prestige voluntarily before starting, or accepts the reset as part of the contract card ("This contract will reset your farm").

#### 1.2.2 B. Difficulty instead of power-scaling
- Static difficulty: goal = `baseGoal × eggValue × difficultyModifier(e)` where `e` is the contract's **rank tier** (Bronze/Silver/Gold/Platinum computed from the deck, not the player).
- New power-progression curve: each tier of contracts has a *release threshold* (e.g. requires bestRunMoney ≥ X), so the *queue* is the progression, not the reward multiplier.
- **Reward formula (replacement):**
  `deposit = baseReward(tier) · (1 + 0.05·challengeDots)`, and Prophecy Eggs are paid as a **Deposit of `prophecyᵢ` separate from payout structure** — see §2.3. This decouples "rewards grow with your total completions" from local success.

#### 1.2.3 C. Refresh & Strategy Layer
- 4 offers refresh **every game-hour, or on prestige (whichever comes first)**. You can also **re-roll one expired offer** per prestige.
- Drafted-modifier approach: when you *choose* Order/Marathon/Challenge cards, modifiers are shown **before** starting ("Accept: Goal $X under −50% Chicken Gain").
- Difficulty dots (0–2) alter the goal/RPM numbers so no two refreshes feel identical.

#### 1.2.4 D. Bug fixes folded in
- Event-driven completion (the rewrite's event bus) instead of `runContract` polling.
- Exit/complete resets **uniform** via the shared `playfield.reset({keep:[...]})` helper (fixes review §2.10 divergence).
- Fix `index = ...` leaked global (`contracts.js:105`).

---

## 2. Balancing & Rapid-Inflation Audit

### 2.1 Inflation map (how systems compound)

Current chain (each link multiplies the previous at no cost):

```
bestRunMoney^0.25  → SoulEggGain          (prestige.js:10)
1 + avgSoul·1.41·prophecyBoost           → SoulEggBoost     (prestige.js:21)
1.015^prophecy × artifact × gem          → ProphecyBoost    (prestige.js:12-18)
√prophecy                               → ContractReward/Goal (prestige.js:24-25)
1 + Σ(tierWeighted·count)  × ALL boosts  → CollectionBoost  (ascension.js:626-645)
1 + √log(planetMoney,5)                  → PlanetBoost      (main.js:206)
```

The three most damaging all run **at the same time, on the same value**: Soul Boost is already `1 + soul·ρ`; Prophecy multiplies it (`ρ`), *and* multiplies SoulEggGain via contracts, *and* Artifacts/Gems multiply it *again*, and CollectionBoost multiplies **all** of those.

### 2.2 Per-system problem & fix table

| System | Problem (audit) | Fix |
|---|---|---|
| **Prophecy Eggs** | Never spent; `1.015^n` forever; softcap at 1e6 kicks in only after absurd counts | Introduce a Prophecy Egg **spend sink** (below, §2.3). Reduce per-egg power to `1.01^n` and make the softcap a hard cap of **1e5×** net mult. |
| **Contracts** | Reward scales with completions + power (self-inflation) | See §1.2. Rewards become bounded per tier; completions unlock *perks* not multipliers. |
| **Soul Egg boost** | `1 + soulAvg·(1.41)·ρ` is linear-with-memory but multiplied by ρ, and memory (avg of current+best) double-counts | Convert to **√soul** scaling: `1 + √soulAvg·0.2·ρ`. Diminishing returns on stock + finite multiplier on flow. |
| **Soul Egg gain** | `bestRunMoney^0.25` with no softcap → super-exponential the further you push one prestige | Keep `^0.25` for early-mid, then apply a prestige-scale softcap: `gain = 1e9·log₁₀(bestRun/1e36)+...` beyond a threshold so late-game gains stay in sane multiples. |
| **Collection Boost** | A single universal multiplier (`ascension.js:636-644`) multiplies **every** artifact boost → inflates all stats | Split into per-group collection bonuses (Egg/Prophecy/Soul/Chicken/Research each scale their own group), and cap each group's total. |
| **Artifacts/Gems + Enlightenment** | `getActiveArtifactBoost` gate means most artifacts silently turn off off-home (user can't see why) | Migrate to data-driven "appliesOn: ['home','enlight','xy'], blockedOn: [...]" — visible on the tooltip, so the *rule* is transparent and not a bug factory. |
| **Harvesters** | Yield lower bound can go **negative** (`ascension.js:814` `Math.floor((level-5i)/3)-2` → `getRandom(-2,…)`) — harvests can *destroy* gems; the `i===3` fudge hand-patches it | Replace with a table-driven yield per tier+level with floor(1). *No negative yields.* |
| **Planet boosts** | `1 + √log(money,5)` (`main.js:206`) is unbounded for all 6 planets | Cap at, e.g., **×100**, and give each planet its own curve (see §4). |
| **Research discount stacking** | Lab (−50% all research, `epicResearch[1]`) × artifact research-cost division (`research.js:335`) multiply | Make discounts **additive, not multiplicative**: total discount = min(sum, 60%). |
| **Offline progress** | Full-rate offline, indefinite (`data.js:83`, loop `diff`) | Offline cap: 12h worth, at 50% effective rate, with an offline report event. |
| **Buy-Max** | Max = 9999 (`data.js:87`) trivialises mid-game | Max = actual max-to-cap, which the geometry already computes — cosmetic, keep. |

### 2.3 The Prophecy Egg economy fix (spend sink)

Make Prophecy Eggs **purchasable-permanent and buyable-permanence**:

- New **Prophecy Workshop**: spend Prophecy Eggs on
  - **Permanent bonuses** (one-time, e.g. +10% Contract payout per rank, +1% Prophecy boost per rank) — *this* replaces the monotonous grind with meaningful "should I buy +ranks or bank for the next tier".
  - **Automators / QoL** (e.g. auto-reroll, 2× offline cap) at Prophecy cost instead of Soul/Knowlegg cost, giving Prophecy Eggs a second, mechanical role.
- This **drains the stock**, so `1.015^n` never runs away, and every contract completion has an immediate decision ("spend on the workshop or bank?").

### 2.4 Inflation guardrails to adopt globally
- **Net-multiplier cap** on {Prophet × SoulBoost × Artifact × Gem} — the product caps at a tier-unlock value (escalating with prestige layer), enforced in a single `economy.recalc()`.
- **One formula, one place**: move every "×soulEggBoost", "×collectionBoost", "×planetBoost" into the derived-state function; delete scattered inline multiplications (`egghandler.js:179-206` etc.).
- **Balance data tables** per the rewrite plan — all exponents live in `content/balance.ts`, tunable without code edits.

---

## 3. New Achievements

> **Framing note:** today there are **53** achievement definitions but only a 48-slot array (`data.js:25`) — the late-game achievements (Hoarder, Extraction Specialist, The Collector, both Anti-Prophecy Club entries) are effectively **un-earnable/incorrectly tracked**. The rewrite must size the array to the definition list *first*. All proposals below assume a clean 0..N index space.

### 3.1 Proposed new achievements (~24 new, pun-consistent with the game voice)
Milestones are *major* (act-level) or *minor* (sub-goal / flavor).

**Egg production / research (minor)**
| ID | Name | Trigger |
|---|---|---|
| 53 | "Barely Scraping By" | Reach $1 while the current egg's value < $0.01 (enlightenment-related) |
| 54 | "Techno-Farmer" | Own 50 levels of the "Machine Learning Incubators" research |
| 55 | "Research Roulette" | Max all Tier I–IV research in a single run, pre-prestige |
| 56 | "Dollar Deca-Billionaire" | Reach bestRunMoney ≥ $1e24 (mid-stage gate milestone) |

**Prestige layer (minor→major)**
| ID | Name | Trigger |
|---|---|---|
| 57 | "Soul Sack" | Own 5,000 Soul Eggs in a single prestige *without* any Prophecy Eggs |
| 58 | "Fifth Time's The Charm" | Prestige 5 times in one day |
| 59 | "Eggconomy Crisis" | Reach a Soul Boost ≥ ×1000 from Soul Eggs alone |

**Contract layer (minor)**
| ID | Name | Trigger |
|---|---|---|
| 60 | "No Shortcuts" | Complete a Marathon contract without any auto-buyers active |
| 61 | "Dealbreaker" | Complete a Challenge contract on the first try (no re-roll) |
| 62 | "Eggcelent Credit Score" | Spend your 1,000th Prophecy Egg in the Workshop (tracks the §2.3 sink) |

**Eggspeditions layer (major — one per planet theme + one completionist)**
| ID | Name | Trigger |
|---|---|---|
| 63 | "Arcturus Archaeologist" | Fully excavate every Arcturus site (§4 site system) |
| 64 | "Nobody Here But Us Chickens" | Discover the Ravnar "silent" event only once (§4.3 secret site) |
| 65 | "Peace Was Never An Option" | Complete Xylok's No-Combat objective without abandoning |
| 66 | "Deep Six" | Reach Triton's depth objective (below the sea floor) |
| 67 | "Slow and Steady" | Max Hereth's Slowness trial in one sitting |
| 68 | "Light at the End" | Unlock malak's final un-shadowed beacon |
| 69 | "Cartographer" | Discover all 6 planets' complete site maps (100% each) |

**Reliquary / Ascension (major)**
| ID | Name | Trigger |
|---|---|---|
| 70 | "One Egg To Rule Them All" | Own all 24 artifacts **and** all 18 gems simultaneously |
| 71 | "Forensics Grad" | Craft 25 Artifacts of Tier III+ in a single ascension |
| 72 | "Harvest Moon" | Have all 6 harvesters running at the same time |
| 73 | "Enlightened Alchemist" | Craft the top-tier Enlightenment-only artifact (§5.3) |

**Stats / fun / secret (flavor — made earnable)**
| ID | Name | Trigger |
|---|---|---|
| 74 | "Lifetime Millionaire" | Pass $1e6 cumulative lifetime earnings (new stat — counter-based) |
| 75 | "Idle Hands" | Play (tab open) for 24h *cumulative* (uses `timePlayed`) |
| 76 | "Marathon Maniac" | Run the newsticker's `getRandom(1,1000) === 1000` line — **and actually fire it** (fixes the unreachable bug, then makes it the achievement) |
| 77 | "Promised Lands" | Prestige with exactly 0 Prophecy Eggs, *after* buying the Anti-Prophecy Club achievement is fixed to be trackable |

> These target the review's findings directly: every currently-unreachable or wrong output (48–52 block) becomes testable, and new tracked stats (`lifetimeEarnings`) are added, not retrofitted onto broken arrays.

---

## 4. Making Achievements Interesting

### 4.1 Give achievements a cost/benefit — currently they're pure flavour (`achievements.js` grants only a notification).
Proposed **three-tier reward model**:
- **Reward on unlock:** +0.5% universal earnings boost per Tier-1 cloak token (meta-flavor, capped at +25% so it never dominates), **or** a small one-time bonus currency (e.g. +10 Soul Eggs early-game, +1 Knowlegg by ascension). *Achievements become a long-tail autobuyer: you always have a next "easier" one to grab.*
- **No effect on the "Soul/Prestige meta" balance at top end:** the aggregate bonus is deliberately ordered below the §2 caps.
- **Achievement "Shop":** tokens (`Eggshells`) earned per achievement feed a **gatcha-lite badge & cosmetic shop** (egg skins on the farm, ticker titles, notify styles) — content path that never affects the economy.

### 4.2 Make them *visible, testable, progressive*
- **Counter achievements**: "Scrounger" becomes ×1 / ×10 / ×100 / ×1000 counters with per-step rewards (like contract count tiers).
- **Seen-but-locked**: hidden achievements show "???" with a *hint* after failing a threshold once (never pure-RNG impossible).
- **Dynamic board**: 6×8 grid stays, but each cell renders lock-state, counter bar when >50%, and a tooltip on click **and** focus (fix the hover-only pattern).
- **Unlock moment**: burn an "ACHIEVEMENT UNLOCKED — [name] [+Eggshell]" toast + egg-head banner in header (the new event bus's job), instead of a passive notification.

### 4.3 Make achievements *gate* content (small, deliberate)
- Reward advances per milestone *unlock* progress bar milestones in the Reliquary and Eggspeditions (e.g., 10 achievements → 3rd loadout slot).
- Gatekeeping stays cosmetic/QoL-only — never required for the core ladder, so it can't block a run.

---

## 5. Eggspeditions — Anti-Monotony Redesign

### 5.1 Why it's samey today
Every planet is a reskin of the same loop:
`be on egg X → pay Y chickens → discover → journey (resets farm) → same research ladder → same ∀PlanetBoost = 1+√log₅(money)` (`main.js:206`). The only differentiation is a numeric multiplier (`eggspeditions.js:1-8`).

### 5.2 Proposed redesign: **Planets as expedition maps with sites**

Each planet becomes a **site map** — a fixed but *procedurally-ordered* tile grid (3×3 for early planets, 4×4 for late) where advancing requires meeting **planet-specific objectives** that *are not just "more money"*:

| Planet | Name after §3 achievements | Unique mechanic replacing the flat boost |
|---|---|---|
| Arcturus | Dark Energy — **"Dig Sites"** | Excavation: spend planet-chickens to *reveal tiles*; each tile = permanent artifact blueprint or planet-currency. Progress = sites revealed. |
| Ravnar | Time — **"Echoes"** | Time-loop puzzles: repeat a 5-minute cycle successfully N times; each loop grants `temporalShard` multiplier that *decays* if you idle. |
| Xylok | Peace — **"No-Fight"** | Harvestless harmony: no harvesters or contracts; units earned by *lounge-time* (AFK gain while others are active). Breaks the "must grind" pattern. |
| Triton | Abyss — **"Depth"** | Dive upgrades the planet's money floor; each depth tier adds a *debuff toggle* you pick for stronger payout (choose-the-risk). |
| Hereth | Lava — **"Crucible"** | Smelt planet-eggs into permanent furnace-fuel; mechanic = *sacrifice* weekly gains for one scaling payoff. |
| Malak | Light — **"Beacons"** | Light *unlit* beacons by switching eggs/planetary states in order; a light puzzle that leans on the rest of the game's state. |

- **Shared glue (optional "Exchange"):** inter-planet trade — send planet-chickens from one planet to buy upgrades on another, giving planets an *economic* relationship and cross-planet content paths.
- **Cost of monotony is intentional choice-making**: each site has 2 mutually exclusive rewards at the end ("pick A or B"), forcing the player to specialise instead of 100%'ing everything in one pass.

### 5.3 Enlightened-Xylok parity
- The current Xylok/Enlightenment confusion (`egghandler.js:203` `currentPlanetIndex === 18`, vs the intended `currentEgg === 18 || currentPlanetIndex === 2` in `ascension.js`) is resolved in the data model: planet has `actsLike: 'enlight'` and the derived-state function only reads flags — the class of bug disappears by construction.

---

## 6. Making the Enlightenment Egg Worth It Over Universe

### 6.1 Why it's not worth it (audit)
- Egg value: **1e-7** vs Universe **1e14** (`egghandler.js:130,137`) — a factor of **1e21** penalty.
- Most artifacts **silently disable** on it (`ascension.js:866`).
- `knowleggBoost` only applies when `data.currentPlanetIndex === 18` is — read literally — never true (the Universe-grind "bug"); so the intended *enlightenment synergist* doesn't even fire.
- Universe is the soul-egg grinder (`money` max); Enlightenment is a forced, awful commute to reach an ascend threshold (`ascension.js:413`).

### 6.2 The redesign: **Enlightenment as the "transcendence" phase**

Make Enlightenment a **deliberate endgame amplifier layer**, not a penalty checkpoint:

1. **Soul-egg engine inversion.** Add a **Lamp system**: while on Enlightenment, each *unit of egg-value earned* charges a **Lamp** (scales with current Soul Boost). On ascend, the Lamp converts into a permanent multiplier on **next-run** Soul-egg gain — so the optimal late-game cycle is:
   - universe run → bank soul eggs (the "payload"),
   - enlightenment run → build Lamp (the "multiplier"),
   - ascend → both bank into the next layer.
   This makes **Universe the money engine and Enlightenment the multiplier engine** — two distinct jobs, not "one good and one dead".
2. **Fix the synergists (not optional).** On the rewrite's data model:
   - `knowleggBoost` applies whenever `state.eggId === 'enlightenment' || state.onPlanet.tier === 2` (fixes the never-true check).
   - Scroll artifacts and Knowledge-family gems gain an explicit `appliesOn:['enlightenment']`; all tooltips show ✅/⛔ per egg.
   - Enlightenment egg value raised from 1e-7 to a *CURVED* value, and its curve is **the answer to "why not Universe"**: penalty factor is inverted into a **synergy table** — e.g. the Lamp gives ×10 soul for the same money once charged.
3. **Enlightenment-only content** (content path, Phase 5):
   - **Enlightened Artifacts** (tier-gated, §3 ID 73 reward): 4 new Enlightenment-only equipment slots whose boosts only exist if you're *on* Enlightenment — making it the *only* place to be for that build.
   - **Transcendence challenges**: risk modes ("Permadeath of money", "No soul eggs during run") that pay permanent Lamp charge.
   - **Endgame meta**: after 18 eggs, the "promote" chain becomes a **veil toggle** — you can stay on Enlightenment *without* losing your farm (no forced `promoteEgg` reset); this removes the "switch = lose everything" tax that pushes everyone back to Universe.

### 6.3 Numeric targets (tuning starting points, all table-driven)
- Lamp charge: `charge = 0.05·√(enlightMoney₋run)·(1+ρ)`; multiplier = `1 + 0.1·charge`.
- Enlightenment value floor raised so x1e21 is reduced to ~x1e12 *before* synergies; synergies add the gap back *through the Lamp*, i.e. the reward is a rate-boost for future, not a permanent stat cushion.
- These live in `content/balance.ts` and are the first things a dev should tune; the intent is that a "Universe-only" strategy is *strictly worse* than alternating runs by endgame.

---

## 7. Interaction Matrix (how the proposals touch each other)

| Proposal | Fixes contract bal. | Fixes prophecy inflation | Fixes eggspedition monotony | Fixes enlightenment | Achievements |
|---|---|---|---|---|---|
| §1 Contract market | ● | ● | ◐ (Expedition cards) | | ◐ (challenge cards) |
| §2.3 Prophecy Workshop | ● | ● | | | ● (credit-score ach) |
| §2 global caps | ● | ● | ● | ● | |
| §3 new achievement set | ◐ | | ● | ● | ● |
| §5 planet maps | | | ● | ◐ (Xylok parity) | ● |
| §6 Enlightenment phase | | | | ● | ● |

---

## 8. Suggested Landing Order (for the v3 rewrite schedule)

1. **Balance guards first** (§2 global caps + Prophecy Workshop + reward decoupling) — otherwise every content addition re-inflates.
2. **Contracts market** (§1) — highest-volume bug and monotony complaint.
3. **Eggspeditions maps** (§5) — biggest "samey" surface.
4. **Enlightenment phase** (§6) — depends on the data-model fix for artifact gating.
5. **Achievement overhaul** (§3–4) — last, because it needs the new counters/stats events the rewrite introduces.

---

*Proposal document. No source files modified. Follow-up from `CODE_REVIEW_REPORT.md` (2026-09-22).*
# Planet Progression and Identity Proposal

**Scope:** how planets are unlocked, what currency they use, and what makes each planet play differently.

**Out of scope:** visual layout for the Eggspeditions screen. That UI is already being handled separately.

**Hard constraint:** no new currencies, and no new one-off systems. Everything below uses mechanics that already exist in Coop Co: money, chickens, common research, egg promotion, prestige, contract-style timed goals, and the existing Enlightenment-style restrictions. Harvesters, artifacts, gems, and the Reliquary are **post-ascension** systems and are deliberately excluded from planet rank rewards.

Five planets are pre-ascension, post-prestige content. **Xylok is the exception:** it is hidden until the player Ascends for the first time, and its rank reward is the legacy Knowlegg-gain buff that helps future Ascensions.

---

## 1. Decision Summary

| Question | Decision |
|---|---|
| What unlocks a planet? | **Soul Eggs**, spent once per planet. |
| Is the cost permanent? | Yes. Once discovered, a planet stays discovered forever. |
| What is a planet? | A **temporary expedition run**, not a sixth permanent farm. |
| How many planets can be active? | One at a time. |
| What persists after a run? | Planet rank, a permanent main-farm boon, and an achievement. |
| Does travelling reset the main farm? | No. The main farm is never reset or replaced. |
| What does a planet give the main farm? | A permanent, capped bonus to one existing stat, plus a small capstone at rank 3. |
| What makes planets unique? | Each planet focuses on a different existing system, and every rank changes the challenge rather than only the target number. |
| Are there new currencies? | No. Soul Eggs are the only unlock cost; run production uses normal money/chickens/research. |
| Do planets interact with harvesters? | No. Xylok is post-ascension, but it still does not use Harvesters, artifacts, or the Reliquary. Its boon is Knowlegg gain. |

---

## 2. Problems With the Legacy Planet Model

The legacy version has good flavour, but the structure causes most of the problems:

1. **Six permanent parallel farms.** Every planet stores its own money, chickens, and research. The player is expected to maintain six separate economies.
2. **Planet power comes from stored planet money.** The boost formula rewards idling on a planet, so the optimal play is to park on a planet and let money grow.
3. **Discovery costs use chickens of a specific egg tier.** That mixes a run-local resource with a permanent unlock, and the UI has to explain which egg's chickens are being spent.
4. **Most planet rules are only numeric penalties.** Arcturus is "research costs more"; Ravnar is "everything is slower"; Hereth is "chicken gain is lower." Those are modifiers, not identities.
5. **Travelling resets the main farm.** That makes planets feel like a separate game and punishes the player for engaging with them.
6. **Planet chickens feed harvesters, but harvesters are post-ascension content.** The player discovers planets long before the Reliquary exists, so the legacy reward for planet chickens has no payoff when it is earned. The planet reward loop needs to be useful in the prestige layer, not borrowed from a later layer.
7. **Planet unlocks were effectively ordered.** The practical route funnelled players through the same planets, and Hereth's chicken-gain boost felt mandatory for making the other planets work. That turned planet choice into a chore.

This proposal keeps the planet names, art, and general flavour, but changes the structure so planets are optional side expeditions that feed the main farm instead of competing with it. Unlocks are independent, so no planet is a gate for another planet.

---

## 3. Unlock Currency: Soul Eggs

### 3.1 Why Soul Eggs

Soul Eggs are the best existing currency for planet unlocks:

| Currency | Persistent? | Current use | Fit for planet unlocks |
|---|---|---|---|
| Money | No | Run production and common research | Bad: resets, so a cost is only a temporary threshold. |
| Chickens | No | Run production, egg promotion gates | Bad: run-local, and the current egg-specific version is confusing. |
| **Soul Eggs** | **Yes** | **Epic Research** | **Good: persistent, visible, and already a meta-progression currency.** |
| Prophecy Eggs | Yes | Epic automation | Bad: too scarce and too late; should stay a contract reward. |
| Knowleggs | Yes | Legendary Research | Bad: ascension-layer currency; only Xylok is post-ascension, so it cannot pay for the other five. |

Soul Eggs also create a meaningful decision. Right now they only buy Epic Research. Adding planet discovery as a second sink means the player has to choose between a permanent stat upgrade and a new piece of content. That is a healthy prestige-layer choice, not a new system.

### 3.2 Unlock Rules

- A planet is unlocked by clicking **Discover** and paying its Soul Egg cost.
- The cost is paid **once**. Replays are free.
- The cost is deducted from `data.currency.soulEggs`.
- `bestSoulEggs` is **not** reduced. The player keeps their historical best.
- Because the Soul Egg boost uses current and best Soul Eggs, spending current Soul Eggs temporarily lowers the boost. That is intentional: the unlock has a real opportunity cost.
- No refunds.
- If a balance patch changes the cost later, already-unlocked planets stay unlocked.

### 3.3 Free-Order Unlocks

Planets do **not** unlock in a chain. Each planet is an independent purchase:

- It checks only its own egg gate, its Soul Egg cost, and, for Xylok, the first-Ascension visibility rule.
- No planet requires another planet's rank or completion.
- No planet's boon is required to unlock or complete another planet.
- A player can skip a planet entirely and still unlock every other planet they qualify for.

The table is sorted by cost only to make tuning readable. The UI must **not** label any planet as "next," "recommended," or "required." The player chooses which visible planet to save for.

| Planet | Egg gate | Availability | Soul Egg cost | Approx. first prestige at gate |
|---|---|---|---:|---:|
| Arcturus | Rocket Fuel | Pre-ascension | 250 | ~700 |
| Ravnar | Fusion | Pre-ascension | 3,000 | ~15,000 |
| Xylok | Quantum | After first Ascension | 25,000 | ~69,000 |
| Triton | Dilithium | Pre-ascension | 50,000,000 | ~263,000,000 |
| Hereth | Antimatter | Pre-ascension | 25,000,000,000 | ~107,000,000,000 |
| Malak | Dark Matter | Pre-ascension | 250,000,000,000 | ~1,050,000,000,000 |

These costs are first-pass tuning targets, not final balance. The guideline is:

> **Planet cost ≈ 20–35% of one expected first prestige at that planet's egg gate.**

That keeps the cost relevant without making the player feel like they have to skip several prestige upgrades. The exact values should be tuned with save-scrubbed test profiles at Rocket Fuel, Fusion, Quantum, Dilithium, Antimatter, and Dark Matter. Xylok's cost may need separate tuning because it is first available after Ascension.

The absence of a chain is intentional. A player who wants Hereth's chicken-gain boon can save for Hereth directly; they do not have to buy Arcturus, Ravnar, Xylok, and Triton first.

### 3.4 Unlock UX Contract

The existing Eggspeditions screen already has the right shape: a planet list, a selected-planet panel, and a discover button. It only needs these values:

- Discovery cost in **Soul Eggs**.
- Current Soul Egg balance.
- The first unmet requirement, if any:
  - `Requires Rocket Fuel`
  - `Requires 25,000 Soul Eggs`
- Rank, current boon, and the next trial's name and target once unlocked.
- A **Start Expedition** button instead of a permanent travel button.
- No "next planet," "recommended," or "complete X first" text. Unlocks are independent, and the UI should not imply an order.
- No harvester, artifact, or Reliquary badge. Xylok is the only planet that acknowledges the Ascension layer, and only through its Knowlegg-gain boon.

**Xylok is hidden, not locked.** Before the first Ascension, do not render a Xylok card with a lock icon. The planet simply does not exist in the list yet. After the first Ascension, it appears like any other visible planet.

The other five planets are visible from the start of Eggspeditions, even when their egg gate or Soul Egg cost is unmet. They show their requirements, but they are never presented as a sequence.

No new header currency. No new icon. The existing Soul Egg icon and formatting can be reused.

---

## 4. Planet Structure: Expeditions, Not Parallel Farms

### 4.1 Core Model

A planet is a **temporary expedition run** with a clear objective.

When the player starts an expedition:

- A fresh run state is created: money, chickens, research, current egg, objective progress.
- The main farm is untouched. It continues to exist and continues to accrue offline/idle progress using the existing rules.
- The Egg and Research tabs are re-bound to the expedition state while the run is active.
- The planet's rule applies to that run.
- The player can return to the main farm at any time.

When the run ends:

- The run's money, chickens, and research are discarded.
- **Planet rank** and its permanent boon are the only things that persist.
- The Egg and Research tabs re-bind to the main farm.

This is the key change from legacy. The player is not maintaining six farms. They are entering a short, focused scenario and coming back with a permanent reward.

### 4.2 Why Not Keep Separate Farms?

Keeping six persistent farms creates three problems that are hard to balance around:

1. The player has to choose which farm to leave idling.
2. Planet power scales with stored money, so the best strategy is to leave a planet running forever.
3. The main farm and planet farms compete for attention instead of feeding each other.

A single active expedition avoids all three. It also makes the planet screen a portal to content rather than a second save file.

### 4.3 Planet Rank

Each planet has a rank from **0 to 3**.

| Rank | Meaning |
|---|---|
| 0 | Discovered, but no expedition completed. |
| 1 | First trial completed. First boon tier, and the rank 2 trial opens. |
| 2 | Second trial completed. Second boon tier, and the rank 3 trial opens. |
| 3 | Final trial completed. Final boon tier, mastery capstone, and mastery achievement. |

- A run always targets the **next rank**.
- Completing the objective ends the run and grants the rank.
- Returning early abandons the run. No rank is granted.
- Replaying a mastered planet is allowed for achievements and practice, but it does not increase the boon past rank 3 and it does not bank a resource.

### 4.4 Planet Boons

Each planet grants a permanent bonus to the **main farm** at each rank. The bonus is capped at rank 3 and is separate from the planet's run.

| Planet | Primary boon | Rank 1 | Rank 2 | Rank 3 | Rank 3 capstone |
|---|---|---:|---:|---:|---|
| Arcturus | Common research cost | −5% | −10% | −15% | +5% egg value |
| Ravnar | Egg laying rate | +10% | +20% | +30% | +5% chicken gain |
| Xylok | Knowlegg gain | +10% | +20% | +30% | +5% Enlightenment Egg value |
| Triton | Soul Egg gain | +10% | +20% | +30% | +5% egg value |
| Hereth | Chicken gain | +10% | +20% | +30% | +5% egg laying rate |
| Malak | Egg value | +10% | +20% | +30% | +5% chicken gain |

Rules:

- Boons are multiplicative with other sources of the same stat.
- Boons apply wherever that stat is used, including future expeditions.
- Boons are permanent across prestige and ascension.
- **Knowlegg gain** is the legacy Xylok planet boost. It increases the Knowleggs awarded by the Enlightenment Egg at Ascension. Xylok is hidden until the player has ascended once, so this is allowed to pay out in the Ascension layer.
- **Soul Egg gain** is applied through the existing Soul Egg calculation. Triton's boon does not create a separate Soul Egg source.
- Rank 3 capstones are deliberately small. They exist to make mastery feel like a capstone, not to add a second progression system.
- Planet money no longer creates an uncapped boost. Rank is the only source of planet power.
- Every **pre-ascension** planet's boon is useful before Ascension. Xylok is the deliberate exception: it is hidden until first Ascension, and its Knowlegg-gain boon is meant to help future Ascensions.

### 4.5 Rank Rewards and the Ascension Boundary

Planet ranks grant **main-farm boons**, not harvester access.

- Rank 1 grants the first boon tier and opens the rank 2 trial.
- Rank 2 grants the second boon tier and opens the rank 3 trial.
- Rank 3 grants the final boon tier, the mastery capstone, and a mastery achievement.
- There is no `planetChickens` stockpile. Expedition runs do not bank chickens for later use.
- Planet ranks do **not** unlock, upgrade, feed, or reset harvesters.
- Planet ranks do **not** require the Reliquary and do not interact with artifacts or gems.

This is intentional for the five pre-ascension planets. Harvesters and the Reliquary are unlocked through legendary research **after Ascension**, while those planets sit in the prestige layer. A reward that only becomes usable several ascensions later is not a reward for the player who just completed the planet.

**Xylok is the one designed exception.** It is hidden until the first Ascension, and its Knowlegg-gain boon is explicitly meant to improve future Ascension payouts. That does not make it a Harvester planet or a Reliquary planet; it simply pays out in the layer where it becomes available.

If a pre-ascension rank feels too weak without a harvester attached, improve its boon or capstone. Do not solve it by adding an Ascension-only reward to those planets.

The old `planetChickens` resource is removed from the design. Legacy saves that contain planet chicken stockpiles should leave existing harvester state untouched, but no new planet chickens are earned.

### 4.6 Main Farm During an Expedition

- The main farm is never reset, swapped, or zeroed.
- It continues to produce using the existing idle/offline rules.
- Active contracts block travel, matching the legacy rule. A player cannot start an expedition while a contract is active.
- Contracts and ascension actions are unavailable during an expedition.
- Prestige and promotion buttons are unavailable during an expedition except where a planet explicitly allows them (Triton prestige, Malak promotion).
- Automation follows the active run context. It does not buy main-farm upgrades while the player is on a planet.

The result: engaging with a planet never costs the player their main-farm progress. The planet is additive content.

---

## 5. Planet Identities

Every planet is built from the same three-part pattern:

1. **Fixed rule** — the planet's permanent twist on an existing system.
2. **Rank trials** — each rank adds a new constraint or objective, not just a bigger target number.
3. **Build decision** — the planet removes a crutch, so the player has to decide what to invest in instead.

No planet gets a bespoke minigame. The depth comes from how the trial reshapes familiar decisions.

### Overview

| Planet | Focus | Fixed rule | Rank 1 trial | Rank 2 trial | Rank 3 trial | Boon |
|---|---|---|---|---|---|---|
| Arcturus | Common research | Research costs scale at 1.35; every research level adds egg value | 25 total levels | 75 levels, breadth across tiers I–VI | 150 levels, breadth across tiers I–XI | Research cost reduction |
| Ravnar | Time / production | Timed run that pauses offline | Earn $1e6, checkpoints grant time | Earn $1e8, checkpoints grant time and production | Earn $1e10 starting at 1/4 speed, checkpoints restore speed | Lay rate |
| Xylok | Passive production / Ascension | Hidden until first Ascension; no manual hatching; Soul/Prophecy boosts disabled; no promotion or prestige | $1e6 with no hatching | $1e8 with no hatching and no egg-value research | $1e10 and 1e7 chickens under both vows | Knowlegg gain |
| Triton | Prestige | Planet prestige only; Soul/Prophecy boosts disabled | 1 planet prestige | 3 prestiges, each depth raises power and cost | 5 prestiges, steeper depth penalties | Soul Egg gain |
| Hereth | Chicken gain | Chicken gain ×1/4; lay rate ×0.5 | 100 chickens/min | 1,000 chickens/min held for 60s | 10,000 chickens/min held for 60s and $1e10 | Chicken gain |
| Malak | Egg promotion | Egg values ×0.25; promotion enabled | 1 promotion | 3 promotions and $1e9 | 5 promotions and $1e12 | Egg value |

The trials are deliberately different: research breadth, timed production, restricted passive production, repeated prestige, sustained chicken rate, and promotion count. A single strategy cannot solve all six.

**Xylok is the only planet hidden before the first Ascension.** The other five are visible from the start of Eggspeditions, with their egg gate and Soul Egg cost shown. Xylok's reward is Knowlegg gain, not starting chickens, and Triton keeps Soul Egg gain.

---

### 5.1 Arcturus — Research Breadth

**Fantasy:** Dark energy makes research volatile, but knowledge compounds.

**Fixed rules:**

- The run uses the **Dark Energy** egg at $1e3. Promotion is disabled.
- Common research costs scale at **1.35** instead of 1.15, matching the legacy planet.
- Every common research level purchased also grants **+1% planet egg value** for the rest of the run. This is additive with itself and multiplicative with normal research effects.
- All normal research effects still apply.
- The player starts with no money and no chickens, so the opening is a bootstrap problem.

**Signature interaction — breadth, not tier spam:**

Research tiers are the map. A player cannot finish Arcturus by repeatedly buying the cheapest tier I research; the higher ranks require at least one level in every tier up to a threshold. That forces the player to push money into new tiers instead of farming one cheap upgrade.

**Trials:**

| Rank | Trial | Target |
|---|---|---:|
| 1 | **First Spark** | 25 total common research levels, any tiers |
| 2 | **Chain Reaction** | 75 total levels, with at least 1 level in every tier from I to VI |
| 3 | **Dark Singularity** | 150 total levels, with at least 1 level in every tier from I to XI |

**Boon:** Common research cost −5% / −10% / −15%. Rank 3 capstone: +5% egg value.

**Why it fits:** It uses the existing Research tab, research tiers, and egg-value stat. The higher cost scaling is the constraint; compounding egg value is the engine. Breadth requirements make each rank a different research problem rather than the same purchase repeated with a larger number.

---

### 5.2 Ravnar — The Time Trial

**Fantasy:** Time is the resource. Spend it well or lose the window.

**Fixed rules:**

- The run uses the **Time** egg at $100. Promotion is disabled.
- The expedition is a **timed run**. The run ends automatically when the timer expires.
- Reaching the money target ends the run immediately.
- The timer pauses while the game is closed. The player should not fail because they stepped away.
- The player starts with a small flock so the opening is not several minutes of clicking.

**Signature interaction — checkpoints buy time and speed:**

Each trial has three checkpoints at 25%, 50%, and 75% of the money target. Reaching a checkpoint grants bonus time and a run-local production boost. Later ranks start the player slower, so the checkpoints are how the run ramps back up. Ignoring checkpoints usually means running out of time.

**Trials:**

| Rank | Trial | Target | Checkpoint effect |
|---|---|---:|---|
| 1 | **First Second** | Earn $1e6 within 5:00 | +15 seconds |
| 2 | **Borrowed Time** | Earn $1e8 within 4:00 | +15 seconds and +10% production for the rest of the run |
| 3 | **Paradox** | Earn $1e10 within 4:00, starting at 1/4 production speed | +15 seconds and +25% production for the rest of the run |

These are first-pass numbers and should be tuned against the planet's base egg value and expected Soul Egg boost. The 1/4 starting speed is the legacy Ravnar time rule; the checkpoints are what make it recoverable.

**Boon:** Egg laying rate +10% / +20% / +30%. Rank 3 capstone: +5% chicken gain.

**Why it fits:** The game already has production ticks and contract-style timed goals. Checkpoints are just timed progress markers. The run is a race with a ramp, not a second farm.

---

### 5.3 Xylok — Vows of Peace

**Fantasy:** A quiet world where nothing is boosted and the farm has to stand on its own.

**Fixed rules:**

- **Xylok is hidden until the player completes their first Ascension.** Once it appears, it can be unlocked with Quantum and Soul Eggs like any other visible planet.
- The run uses the **Peace** egg at $10. Promotion and prestige are disabled.
- **Manual hatching is disabled.** The player starts with a flock and must rely on chicken gain and research.
- Soul Egg and Prophecy Egg boosts are disabled.
- The run behaves like the **Enlightenment Egg**: artifact and gem boosts do not apply unless an existing Enlightenment exception enables them. This proposal adds no new Reliquary rules.

**Signature interaction — vows:**

Each rank adds a voluntary restriction that removes a crutch. The restrictions stack, so rank 3 is the same planet played under the accumulated vows rather than a different planet with a bigger number.

**Trials:**

| Rank | Trial | Vow | Target |
|---|---|---|---:|
| 1 | **Vow of Stillness** | No manual hatching. All research allowed. | Earn $1e6 |
| 2 | **Vow of Silence** | No manual hatching, and no research that grants Egg Value (mixed value/rate researches count as value research). | Earn $1e8 |
| 3 | **Vow of Enlightenment** | No manual hatching, no egg-value research, and no promotion or prestige. | Earn $1e10 and reach 1e7 chickens |

The rank 3 chicken target is deliberate. It makes the final trial test the passive chicken engine directly, not just a large money number that could be reached by waiting.

**Boon:** Knowlegg gain +10% / +20% / +30%. This is the legacy Xylok planet boost: it increases the Knowleggs awarded by the Enlightenment Egg at Ascension. Rank 3 capstone: +5% Enlightenment Egg value (the existing `knowleggBoost` stat).

**Why it fits:** It uses existing manual hatching, chicken gain, and research. The Enlightenment restrictions are familiar, and Knowlegg gain is the reward the legacy game already attached to Xylok. Because Xylok is hidden until the first Ascension, this is the one planet whose permanent reward is allowed to pay out in the Ascension layer.

---

### 5.4 Triton — The Abyss

**Fantasy:** The abyss strips away Soul and Prophecy boosts, so the only way forward is to reset and dive again.

**Fixed rules:**

- The run uses the **Abyss** egg at $1. Promotion is disabled.
- Soul Egg and Prophecy Egg boosts are disabled.
- **Planet prestige is enabled.** It uses the existing prestige reset pattern, but it is scoped to the expedition:
  - Resets expedition money, chickens, and research.
  - Does **not** grant main-farm Soul Eggs.
  - Increments `planetPrestiges`.
  - Grants a run-local **Abyss Depth** multiplier to egg value.
- Planet prestige requires a money threshold. The threshold rises with each prestige.
- The run ends when the rank's prestige count is reached.

**Signature interaction — depth versus cost:**

Each planet prestige makes the next dive more productive but also more expensive to rebuild. The player has to decide whether to dive early for the multiplier or push the current dive for a better threshold. Abyss Depth is a run counter, **not a currency**; it resets when the expedition ends.

**Trials:**

| Rank | Trial | Target | Depth effect |
|---|---|---:|---|
| 1 | **First Dive** | 1 planet prestige | +20% egg value per depth, no extra penalty |
| 2 | **Three Fathoms** | 3 planet prestiges | +20% egg value and +10% research cost per depth; −1 starting chicken per depth after the first |
| 3 | **The Abyss Stares Back** | 5 planet prestiges | +25% egg value and +15% research cost per depth; −1 starting chicken per depth after the first; prestige threshold rises faster |

Starting chickens cannot go below 1. This makes later dives slower to start but much stronger once they get going, which is the point of the planet.

**Boon:** Soul Egg gain +10% / +20% / +30%. Rank 3 capstone: +5% egg value. Triton keeps Soul Egg gain; Xylok's move to Knowlegg gain means the two no longer overlap.

**Why it fits:** Prestige is already the core reset loop. Triton asks the player to use that loop inside a contained scenario. The main-farm Soul Egg reward is the permanent payoff; the planet itself generates no Soul Eggs. `planetPrestiges` and `Abyss Depth` are objective counters, not currencies.

---

### 5.5 Hereth — The Lava Farm

**Fantasy:** A world of lava where chickens are scarce and every unit of chicken gain matters.

**Fixed rules:**

- The run uses the **Lava** egg at $0.5. Promotion is disabled.
- Chicken gain is **1/4** of normal, matching the legacy `diff/60` vs `diff/15` behaviour.
- Egg laying rate is **×0.5**, matching the legacy planet.
- Manual hatching is allowed, but it is not efficient enough to carry the run.
- The player starts with a small flock so production can begin.

**Signature interaction — sustained rate, not stockpile:**

Rank 2 and rank 3 require the player to **hold** a chickens-per-minute rate for 60 seconds, as well as reach a money target. A burst of manual hatching can raise the chicken count, but it cannot fake the rate. The player has to invest in Internal Hatchery research and keep production stable.

**Trials:**

| Rank | Trial | Target |
|---|---|---:|
| 1 | **Kindling** | Reach 100 chickens/min |
| 2 | **Stoked** | Reach 1,000 chickens/min and hold it for 60 seconds |
| 3 | **Lava Flow** | Reach 10,000 chickens/min, hold it for 60 seconds, and earn $1e10 |

The sustain timer is a contract-style progress check, not a new system. If the rate drops below the target, the 60-second hold resets.

**Boon:** Chicken gain +10% / +20% / +30%. Rank 3 capstone: +5% egg laying rate.

**Why it fits:** It uses the existing chicken gain stat, laying rate, and Internal Hatchery research line. The penalty is the challenge, the sustain is the depth, and the reward is the same stat the player had to solve.

---

### 5.6 Malak — The Light Ladder

**Fantasy:** Light in the dark. Egg values are tiny, so the only way up is the egg ladder.

**Fixed rules:**

- The run uses the standard egg ladder, but every egg value is **×0.25**. The planet's visual identity is the **Light** egg.
- **Promotion is enabled**, unlike the other planets.
- Promotion uses the normal reset: money, chickens, and research reset, and the next egg is unlocked.
- Each promotion grants a run-local **Light** multiplier: +50% egg value, stacking for the rest of the run. This is a run counter, not a currency.
- Soul Egg and Prophecy Egg boosts apply normally.

**Signature interaction — the ladder accelerates:**

Low egg values make the first promotion slow. The stacking Light multiplier means each later promotion is faster than the last. The trial is not just "promote five times"; it is "build a run that can keep climbing the ladder while every egg is worth a quarter of normal."

**Trials:**

| Rank | Trial | Target |
|---|---|---:|
| 1 | **First Light** | 1 promotion |
| 2 | **Candle in the Dark** | 3 promotions and earn $1e9 |
| 3 | **Dawn** | 5 promotions and earn $1e12 |

The money targets prevent the player from promoting immediately and calling the run finished. They have to use each egg before moving on.

**Boon:** Egg value +10% / +20% / +30%. Rank 3 capstone: +5% chicken gain.

**Why it fits:** Promotion is already a core mechanic. Malak is the only planet where the ladder itself is the objective. The low egg value makes each promotion a real step, the Light multiplier gives the run internal momentum, and the expedition is still temporary, so it does not become a parallel main farm.

---

## 6. Progression Flow

There is no required planet route. One possible sequence:

1. Player reaches Rocket Fuel and sees the five pre-ascension planets, each with its own requirements. No planet is highlighted as the first step.
2. Player prestiges and buys Arcturus for 250 Soul Eggs, or saves for Ravnar instead.
3. Player starts an Arcturus expedition. The main farm is untouched.
4. Player buys research under the 1.35 cost scaling until 25 total levels.
5. Rank 1 is granted. Arcturus gives −5% research cost permanently and opens its rank 2 trial.
6. Player returns to the main farm. They can replay Arcturus, buy Ravnar, or save toward any other visible planet. No planet is gated behind Arcturus.
7. Reaching Fusion satisfies Ravnar's egg gate; reaching Dilithium satisfies Triton's, and so on. Those planets were already visible, but now they can be purchased. Buying one planet does **not** reveal or unlock another.
8. After the first Ascension, Xylok appears. It still requires Quantum and 25,000 Soul Eggs, but it can be bought whenever those conditions are met, regardless of which other planets the player owns.

The only pacing is the egg gate and the Soul Egg cost. A player who wants Hereth can save for Hereth as soon as they reach Antimatter, without buying Arcturus, Ravnar, Xylok, or Triton first.

---

## 7. Interaction With Existing Systems

### Prestige

- Planet unlocks and ranks persist across prestige.
- Soul Egg spending on planets is a legitimate alternative to Epic Research.
- Planet boons apply to Soul Egg gain (Triton), Knowlegg gain (Xylok), and all other stats after prestige/ascension.
- Planet runs do not award Soul Eggs or Knowleggs directly, so they cannot be used to bootstrap either reset loop.

### Contracts

- Active contracts block travel, matching legacy.
- Contracts are unavailable during an expedition.
- Planets do not award Prophecy Eggs directly. Prophecy Eggs stay a contract-layer currency.
- Ravnar's timed run reuses the idea of a timed goal, but it is not a contract and does not affect contract rewards.
- Triton does not modify contract goals or rewards. Its boon remains Soul Egg gain.

### Ascension, Harvesters, and the Reliquary

- Planet ranks do **not** unlock, upgrade, feed, or reset harvesters.
- Planet expeditions do **not** produce `planetChickens` or any other harvester currency.
- Harvesters and the Reliquary remain gated behind legendary research and Ascension, exactly as they are now.
- Planet ranks persist across Ascension. The five pre-ascension planets are not Ascension rewards and do not shortcut Ascension content.
- **Xylok is the deliberate post-ascension planet.** It is hidden until the first Ascension, then unlocks normally. Its Knowlegg-gain boon feeds the existing Ascension payout and does not feed Harvesters or the Reliquary.
- Xylok keeps its legacy Enlightenment flavour, but its challenge uses the existing Enlightenment-style restrictions. It does not add artifacts or gems to planet progression.
- A broader post-ascension planet system should be designed separately. Xylok is the only crossover in this proposal.

### Achievements

- Planet discovery achievements should check `data.progression.unlockedPlanet[i]`, not the old `data.progression.planets[i]`.
- Add mastery achievements for rank 3 on each planet, using the existing achievement system.
- No new achievement currency or condition types are required.

### Automation

- Automation follows the active run context.
- On the main farm, it behaves as it does now.
- On an expedition, it only touches expedition state.
- It never buys main-farm upgrades while the player is on a planet.
- Automation cannot bypass a planet's trial restrictions. For example, Malak's promotion goal still requires the normal promotion thresholds, and Xylok's research vow still forbids egg-value research even if an automator would normally buy it.

---

## 8. Data and Implementation Sketch

This section is intentionally small. It describes the shape of the data, not the final implementation.

### 8.1 Planet Definitions

Move planet balance out of UI code and into `EggspeditionsManager.js`.

```js
export const planets = [
  {
    id: 0,
    name: "Arcturus",
    imgSrc: "Images/planet1.png",
    egg: {
      name: "Dark Energy",
      value: new Decimal(1e3),
      imgId: "darkenergy"
    },
    unlock: {
      eggIndex: 3,
      cost: new Decimal(250),
      requiresFirstAscension: false
    },
    rule: "researchBreadth",
    trials: [
      { rank: 1, objective: "researchLevels", target: 25 },
      { rank: 2, objective: "researchLevels", target: 75, tierBreadth: 6 },
      { rank: 3, objective: "researchLevels", target: 150, tierBreadth: 11 }
    ],
    boon: {
      stat: "researchCost",
      perRank: 0.05,
      capstone: { stat: "eggValue", amount: 0.05 }
    }
  },
  // ...
]
```

Each planet needs only:

- `name`, `imgSrc`
- run egg (`name`, `value`, `imgId`) or a flag for the standard egg ladder
- `unlock` gate (`eggIndex`, `cost`, `requiresFirstAscension`)
- `rule` identifier
- `trials` array: one objective and one constraint per rank
- primary boon stat and per-rank amount
- optional rank 3 capstone stat and amount

There are deliberately no harvester, artifact, gem, or `planetChickens` fields.

### 8.2 Save Shape

Replace `progression.planets` with rank data and add one active expedition slot.

```js
progression: {
  // existing fields...
  unlockedPlanet: new Array(planets.length).fill(false),
  planetRanks: new Array(planets.length).fill(0)
},

expedition: {
  planetIndex: -1,
  rankTarget: 1,
  money: Decimal.dZero,
  chickens: Decimal.dZero,
  research: new Array(commonResearch.length).fill(Decimal.dZero),
  currentEgg: 0,
  objective: {
    researchLevels: 0,
    checkpoint: 0,
    planetPrestiges: 0,
    abyssDepth: 0,
    promotions: 0,
    chickenRate: Decimal.dZero,
    sustainTimer: 0
  },
  elapsed: 0,
  timeRemaining: 0
}
```

- `indexValues.currentPlanet` remains the UI selection index.
- `expedition.planetIndex` is `-1` when the player is on the main farm.
- There is only one expedition slot, so there is no `planetData` array of six farms.
- There is no `planetChickens` and no `chickensProduced`. Planet runs do not bank a currency.
- Objective counters such as `planetPrestiges`, `abyssDepth`, and `promotions` are **not currencies**. They exist only for the active trial and are discarded when the run ends.
- No currency fields are added.

### 8.3 Functions

`EggspeditionsManager.js`:

- `canUnlockPlanet(index, data)` — checks egg gate, Soul Egg cost, and Xylok's first-Ascension visibility. It does **not** check another planet's rank.
- `unlockPlanet(index, data)` — deducts Soul Eggs and sets the unlock flag.
- `isPlanetVisible(index, data)` — returns false only for Xylok until `hasAscended`. The other five are always visible once Eggspeditions is unlocked; their egg gate is an unlock requirement, not a visibility rule.
- `startExpedition(index, data)` — creates fresh expedition state for the next rank.
- `updateExpedition(diff, data)` — applies the planet rule and updates objective progress.
- `completeExpedition(data)` — grants the rank, applies the boon/capstone, and clears the run.
- `returnFromExpedition(data)` — clears the run, grants no rank, and banks nothing.
- `getPlanetBoon(statName, data)` — returns the multiplier for a stat, including the rank 3 capstone where relevant. This covers Xylok's Knowlegg gain and Triton's Soul Egg gain.

### 8.4 Main Loop

- The main farm continues to run as it does now.
- If `expedition.planetIndex >= 0`, run the expedition update as well.
- The Egg and Research tabs read from `expedition` while it is active; otherwise they read from the main farm.
- On load, if an expedition was active, resume it. Ravnar's timer pauses while the game is closed.
- Hereth's 60-second sustain timer also only advances while the expedition update is running.
- On return, discard expedition state and re-bind the UI to the main farm.
- Pre-ascension rank rewards are applied through the normal stat calculation path and must not rely on Ascension-only state. Xylok's Knowlegg gain is the one exception: it is applied in the existing Ascension payout calculation.

---

## 9. Balance Guardrails

- **No uncapped planet scaling.** Rank 3 is the maximum. Planet money no longer feeds an infinite boost.
- **No direct Soul Egg/Prophecy Egg/Knowlegg rewards from planet runs.** The only main-farm output is the permanent boon and rank 3 capstone. Xylok's Knowlegg gain modifies future Ascension payouts; it does not award Knowleggs when the expedition ends.
- **No Ascension-only rewards for the five pre-ascension planets.** Harvesters, artifacts, gems, and Reliquary content are out of scope. Xylok is the one deliberate post-ascension planet, and its Knowlegg-gain boon is the only Ascension-facing reward.
- **Costs are one-time.** Replays are free, so a player who unlocks a planet is never locked out of practising it.
- **Unlocks are independent.** No planet may require another planet's rank, completion, or boon. Do not add a "complete X first" check later without revisiting this design.
- **No starting-chicken planet boon.** `Start with 1 Chicken` remains an Epic Research only. Xylok uses Knowlegg gain instead.
- **Xylok stays hidden until the first Ascension.** Do not show a locked Xylok card before then. Xylok's Knowlegg gain must be applied to the existing Ascension payout, not to a new currency or a Harvester.
- **Boon values are modest at first.** +30% to one stat per planet is meaningful but not mandatory. If playtesting shows planets feel optional, raise rank 3 or improve the capstone; do not add another scaling layer.
- **Each rank must change the challenge.** Do not ship three ranks that only multiply the target by ten. At minimum, rank 2 adds a build constraint and rank 3 adds a second constraint or a two-part objective.
- **Ravnar's timer must pause offline.** Otherwise the planet punishes normal idle-game behaviour.
- **Xylok must start with a flock.** Otherwise "no manual hatching" is a soft lock.
- **Triton and Malak need objective counters, not stockpiles.** Their resets should not wipe the progress that the trial is checking.
- **Hereth's sustain check must not count manual hatching as rate.** Otherwise the rank 2/3 trial can be brute-forced by clicking.
- **Malak's Light multiplier is run-local.** It must not become a permanent global egg-value boost.

---

## 10. Migration From Legacy Saves

If legacy saves are imported:

| Legacy field | New field |
|---|---|
| `planetsDiscovered[i]` | `progression.unlockedPlanet[i]` |
| `discoveries` | Derived count of unlocked planets |
| `planetData[i].chickens` | Discarded for planet progression; existing Ascension harvester state is left untouched |
| `planetData[i].money` | Discarded |
| `planetData[i].research` | Discarded |
| `currentPlanetIndex` / `onPlanet` | Reset to `-1` |
| `planets` farm array | Removed; replaced by `planetRanks` |

Players who already discovered a planet keep it unlocked. They start at rank 0 and play the new expedition content. If the migration wants to preserve some legacy progress, grant rank 1 to planets that had meaningful stored money, but do not grant rank 2/3 automatically.

**Xylok remains hidden until the save has completed its first Ascension.** If a legacy save has Xylok discovered but has never ascended, preserve the unlock flag and rank, but do not render Xylok until `hasAscended` is true. Once the player ascends, Xylok appears with its existing unlock/rank intact.

Do **not** migrate `planetData[i].chickens` into a new planet-currency field. There is no planet chicken resource in this design. Existing legacy harvester levels and artifacts can be preserved independently if the save already has them, but they are not connected to planet ranks.

Update the planet discovery achievements to use `unlockedPlanet`. Remove the old `data.progression.planets` checks in `AchievementsManager.js`.

---

## 11. Acceptance Criteria

The design is done when:

- [ ] A planet can be discovered by spending Soul Eggs, once, and the unlock persists.
- [ ] Soul Egg spending is visible in the existing UI, and the cost cannot be paid twice.
- [ ] No planet requires another planet's rank, completion, or boon.
- [ ] The UI never labels a planet as "next," "recommended," or "required."
- [ ] Starting an expedition never zeroes, swaps, or otherwise damages the main farm.
- [ ] Only one expedition can be active at a time.
- [ ] Every planet has a distinct fixed rule and a distinct objective metric.
- [ ] Each rank changes the challenge through a new constraint or two-part objective, not only a larger target.
- [ ] Planet ranks 0–3 persist across prestige and ascension.
- [ ] Each rank grants a permanent boon, and rank 3 grants its capstone.
- [ ] Every pre-ascension planet's rank reward is usable before Ascension. Xylok is the deliberate post-ascension exception.
- [ ] Xylok is hidden until the first Ascension and appears afterwards without requiring another planet.
- [ ] The other five planets are visible from the start of Eggspeditions, with their egg gate and Soul Egg cost shown.
- [ ] Xylok's rank boon is Knowlegg gain, not starting chickens, and it applies to the existing Ascension payout.
- [ ] Triton's rank boon remains Soul Egg gain.
- [ ] No planet grants a starting-chicken bonus; `Start with 1 Chicken` stays an Epic Research only.
- [ ] No rank unlocks, feeds, or requires harvesters, artifacts, gems, or the Reliquary. Xylok's Knowlegg gain does not require Knowleggs to unlock.
- [ ] No `planetChickens`, `chickensProduced`, or other planet currency exists in the save or UI.
- [ ] No new currency exists in the save or UI.
- [ ] The six objective families are: research breadth, timed money, restricted passive money, planet prestiges, sustained chicken rate, and promotions.
- [ ] A player can return to the main farm at any time without losing main-farm progress.
- [ ] The old `data.progression.planets` farm array and `planetData` are gone.

---

## 12. Open Decisions

These are the only points that still need a product call:

1. **Unlock cost tuning.** Default: the independent costs in section 3.3. Tune each planet separately; do not reintroduce a chain to fix pacing.
2. **Three ranks vs. five.** Default: three, because it keeps each planet to one fixed rule and three escalating trials. More ranks would need more constraints, not bigger numbers.
3. **Ravnar's timer.** Default: 5:00 at rank 1, 4:00 at ranks 2 and 3, paused offline. Tune after measuring how long the other planets take.
4. **Xylok's post-Ascension gate.** Default: hidden until first Ascension, then requires Quantum and 25,000 Soul Eggs. If that cost is trivial after Ascension, raise it; if it is too steep, lower it.
5. **Malak's promotion ladder.** Default: promotion enabled with 0.25× egg values and a stacking +50% Light multiplier per promotion. If that makes the ladder too fast, lower the multiplier to +25%.
6. **Rank 3 capstones.** Default: a small +5% secondary stat. If playtesting shows rank 3 does not feel distinct, strengthen the capstone rather than adding a new reward layer.
7. **Boon strength.** Default: +10% per rank, max +30%. Raise rank 3 only if playtesting shows planets are not worth the Soul Egg cost.

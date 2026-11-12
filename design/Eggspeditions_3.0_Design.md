# Eggspeditions 3.0 — Design Document

## 1. Purpose and Source
This document expands on `design/eggspeditionsDesign.md` into a high-level design for Eggspeditions 3.0. It defines the shared structure, system interactions, UI wireframes, and per-planet designs for both Regular (post-prestige) and Harvester (post-ascension) Eggspeditions.

This document is intentionally implementation-agnostic: it describes behavior, structure, and player-facing flows without prescribing code or pseudocode.

---

## 2. Base Overview

### 2.1 Progression Structure
- **Regular Eggspeditions (Post-Prestige):** 3-tier challenge structure per planet.
  - **3 tiers of goal leveling:** Each tier raises the target/complexity required to complete that planet's challenge.
  - **3 tiers of bonus reward:** Completing each tier grants escalating rewards (e.g., permanent bonuses, currencies, unlock progress, or efficiency multipliers relevant to the broader game economy).
- **Harvester Eggspeditions (Post-Ascension):** Effectively tiers 4–6 for each planet.
  - Completion of earlier Eggspedition tiers enables harvester construction.
  - Harvester progress introduces persistence across Ascension based on harvester tier/build state.

### 2.2 Planet Discovery and Entry
- **Discovery cost:** Players spend Soul Eggs to discover a planet.
- **Scaling:** Discovery cost increases with each planet discovered, making discovery order a strategic choice.
- **Starting resources:** After beating Tier 1 on a planet, the player establishes a base foothold (e.g., starting material allotment such as common research tiers or money) that reduces friction for subsequent attempts/tiers on that planet, as defined by progression rules.

### 2.3 Planet Roster and Gimmicks
| Planet   | Theme    | Core Gimmick |
|----------|----------|--------------|
| Arcturus | Energy   | Dark Energy Eggs fuel production equipment to generate money (indirect monetization). |
| Ravnar   | Time     | Temporal Flux builds with Time Egg production, suppressing production/chicken gain; must be managed/vented. |
| Xylok    | Peace    | Low prices and slower pace; chickens are gained by manually choosing to hatch eggs. |
| Triton   | Darkness | Balance abyss/light: too much light collapses runs, too little collapses egg value. |
| Hereth   | Lava     | Convert Lava Eggs into materials, trade/sell into a manipulable stock-market-like system. |
| Malak    | Light    | Feed Light Eggs to an "Orb" to expand influence and value, with scaling cost and possible decay. |

---

## 3. High-Level Systems Overview

### 3.1 System Layers
1. **Meta/Progression Layer**
   - Tracks discovered planets, tier completion, rewards unlocked, harvester build state, and persistence rules across Prestige/Ascension.
   - Owns Soul Egg spend for discovery and global reward application.
2. **Planet Session Layer**
   - Instantiates the active planet challenge state (resources, gimmick meters, tier goals, timers/turn-like updates as applicable).
   - Applies planet-specific rules for production, conversion, loss conditions, and completion checks.
3. **Economy & Resource Layer**
   - Manages shared and planet-local resources (eggs, chickens, money, materials, special meters like flux/light/orb influence).
   - Handles conversions (e.g., burn eggs for power, sell eggs for money/materials, feed eggs into systems, contribute resources to harvester construction).
4. **Presentation/UI Layer**
   - During an active Eggspedition, replaces the standard global header with a **Planet-Only Header** and renders a planet-specific challenge view.
   - Renders a consistent in-session layout (header, goal/progress, resources, gimmick module, construction/funding module when applicable, alerts).
   - Surfaces alerts for threshold risks (collapse, devaluation, cap reached, decay warnings, construction shortfalls).

### 3.2 How Planets Interact
- **Isolation with meta links:** Each planet runs as a self-contained challenge context with its own rules and local state, but interacts with the meta layer through:
  - **Discovery gating** (Soul Egg cost, unlock state).
  - **Tier completion outputs** (rewards and progression flags).
  - **Harvester persistence** (post-ascension state retained according to harvester tier/build progress).
  - **Starting foothold** granted after Tier 1 to ease re-entry/further tiers.
- **No direct cross-planet simulation dependency:** Planet gimmick systems (flux, light balance, market indices, orb decay, etc.) operate within the active planet session and do not require simultaneous simulation of other planets.
- **Shared player understanding, distinct mechanics:** A common UI grammar (planet header, goals, tier tracker, resource bar, status alerts) helps players transfer knowledge while each planet's central mechanic remains unique.

### 3.3 Content Rendering and UI Composition
- **Planet-Only Header (replaces standard global header during Eggspeditions):**
  - Planet identity and theming (name, theme, visual motif context).
  - Core navigation/context actions (return to Eggspeditions/planet map, session info/help).
  - Current mode and tier (Regular Tier 1–3 or Harvester Tier 4–6).
  - High-priority status indicator(s) relevant to the planet state (e.g., stable/at risk, vent charges, decay warning, market health).
- **Session body (planet view):**
  - **Goal/Progress panel:** Regular tier objective progress, or Harvester funding/build objective progress.
  - **Resource summary:** Eggs, chickens, money, and planet-specific currencies/meters.
  - **Primary planet module:** Planet-specific gimmick visualization and controls.
  - **Harvester Construction module (Harvester mode):** Funding inputs, build milestones, construction progress, and persistence summary.
  - **Alert and feedback strip/panel:** Contextual warnings, thresholds, and outcome messaging.
- **State-driven rendering:**
  - UI reflects current mode, goal progress, resource changes, risk states, and construction state.
  - On completion/failure transitions, the view presents results and next-step options (retry, advance tier, continue/build harvester, return to map) within mode rules.

### 3.4 Regular vs. Harvester Mode Relationship
- **Regular:** Focused on mastering the planet gimmick to meet tiered challenge goals and earn tiered rewards.
- **Harvester:** Preserves a foundation of planetary progress and shifts emphasis to long-term buildout/funding while retaining the core gimmick as an ongoing constraint/opportunity.
- **Harvester construction model:**
  - Standard goals are replaced/augmented by **funding goals**.
  - Players feed **eggs, chickens, and money** into harvester construction alongside managing the planet gimmick.
  - Construction milestones define build progress and persistence outcomes.
- **Persistence rule (high level):** Harvester construction milestones determine how much planetary challenge progress is retained through Ascension (Tier 1 harvester preserves Tier 1 challenge progress; Tier 3 preserves all challenge tiers, etc., as specified).

---

## 4. Planet Designs

## 4.1 Arcturus — Energy
**Theme:** Dark Energy Eggs fuel production equipment to make money.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  ARCTURUS // ENERGY        Regular Tier 1        Status: STABLE   |
| [Gimmick Help] [Session Info]                                                    |
+----------------------------------------------------------------------------------+
| Resources: Dark Energy Eggs: #### | Stored Power: #### | Money: #### | +$##/s    |
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Earn $X total / Sustain Y output                                 |
| [=====================>---------------------] 62%                                 |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Power Generation & Burn Control                          |
|  +---------------------------+   +---------------------------+                   |
|  | FUEL INPUT                |   | PRODUCTION EQUIPMENT      |                   |
|  | Eggs to burn: [ - ][##][+] |   | Generator A  [ONLINE]    |                   |
|  | Burn rate:  [ Low|Med|High] |   | Output: +$##/s           |                   |
|  | [BURN EGGS]               |   | Efficiency: ##%          |                   |
|  | Reserve: [ ] keep minimum  |   | Upgrades: [View/Buy]     |                   |
|  +---------------------------+   +---------------------------+                   |
|  Power Flow: [Eggs] -> [Burn Chamber] -> [Power] -> [Money Output]              |
|  State: Stable / Low Fuel / Overcapacity / Idle                                   |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Money is generated from powered equipment, not eggs directly."   |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  ARCTURUS // ENERGY   Harvester Build T4 (Tier 1)  Power: ONLINE  |
| [Gimmick Help] [Build Details] [Persistence: T1 Regular retained on completion]  |
+----------------------------------------------------------------------------------+
| Resources: Dark Energy Eggs: #### | Chickens: #### | Money: #### | Power: ####  |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Foundational Harvester Core                          Build: 38%       |
| [==============>-------------------------------]                                  |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | POWER GENERATION                 | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | Eggs to burn: [ - ][##][ + ]     | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | [BURN EGGS]  Output: +$##/s      | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | Equipment: Stable / Low Fuel     | |
| |----------------------------------------| | | Reserve mgmt affects build pace   | |
| | MILESTONES                             | | +----------------------------------+ |
| | [x] Site Prep   [>] Core Assembly      | |                                      |
| | [ ] Grid Link   [ ] Activation         | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Balance fuel burn for income with contributions to construction."|
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Build and operate an energy-to-money pipeline by burning Dark Energy Eggs to power production equipment.
- **Core loop:**
  1. Produce/accumulate Dark Energy Eggs.
  2. Allocate eggs to burn for power (balancing reserve vs. throughput).
  3. Powered equipment generates money/output toward tier goals.
  4. Reinvest/adjust to meet higher tier targets.
- **Tier progression (high level):**
  - **Tier 1:** Establish a basic burn-to-power-to-money chain and reach an initial output/funding threshold; grants base foothold materials/resources.
  - **Tier 2:** Higher output or efficiency targets requiring better allocation and sustained operation.
  - **Tier 3:** Most demanding targets emphasizing optimized fuel management and production stability.
- **Key player decisions:** Burn rate, fuel reserves, timing of spending/allocation, and prioritizing throughput vs. stability.
- **Failure/pressure framing:** Insufficient fueling stalls progress; poor allocation can slow goal completion even without a hard collapse mechanic stated.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Standard completion goals are replaced/augmented by a **funding and construction goal** to build out the Arcturus harvester.
- **Core loop extension:**
  1. Continue burning Dark Energy Eggs to generate money and operational capacity.
  2. Feed **eggs, chickens, and money** into harvester construction/funding milestones.
  3. Maintain energy production while diverting resources to build progress.
- **Harvester design intent:** A planetary energy-extraction installation that scales with investment and preserves Arcturus progress across Ascension based on harvester tier.
- **Tier progression (high level):**
  - **Tier 4 (Harvester Tier 1 build):** Establish foundational harvester infrastructure; preserves Tier 1 Regular challenge progress across Ascension.
  - **Tier 5:** Expand capacity/funding requirements; improves persistence/buildout depth.
  - **Tier 6 (Harvester Tier 3 build):** Complete full harvester challenge scope; preserves all Regular challenge tiers on Arcturus across Ascension.
- **Key tension:** Short-term power/money efficiency vs. long-term harvester investment.

---

## 4.2 Ravnar — Time
**Theme:** Temporal Flux builds up from Time Egg production and suppresses progress if unmanaged.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  RAVNAR // TIME            Regular Tier 2       Flux: 71% RISING  |
| [Gimmick Help] [Vent Status: ● ● ○]                                              |
+----------------------------------------------------------------------------------+
| Resources: Time Eggs: #### | Chickens: #### | Prod Mult: ##% | Gain Mult: ##%    |
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach target output/progress before instability lockup            |
| [==================>-------------------------] 54%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Temporal Flux Management                                 |
|  +----------------------------------+   +------------------------------------+  |
|  | TEMPORAL FLUX METER              |   | VENTING / CONTROL ACTIONS          |  |
|  | Capacity: [##########-----] 71%  |   | Vent Charges: ● ● ○  (limited)     |  |
|  | Effect: Egg prod ↓  Chicken ↓    |   | [VENT METHOD A]  [VENT METHOD B]   |  |
|  | At 100%: production/gain -> 0    |   | Effect preview: -##% flux          |  |
|  | Trend: Rising / Falling / Stable |   | Availability/Cooldown: ...         |  |
|  +----------------------------------+   +------------------------------------+  |
|  Production Panel: Time Egg rate, projected flux growth, safe operating window    |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Higher Time Egg output increases Temporal Flux pressure."         |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  RAVNAR // TIME      Harvester Build T5 (Tier 2)  Flux: 48% STABLE|
| [Gimmick Help] [Build Details] [Vent: ● ○ ○] [Persistence: T1+ progress track]   |
+----------------------------------------------------------------------------------+
| Resources: Time Eggs: #### | Chickens: #### | Money: #### | Flux Capacity: 48%   |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Stabilization Array Expansion                        Build: 51%       |
| [====================>-------------------------]                                  |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | TEMPORAL FLUX                    | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | [########-----------] 48%        | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | Prod/Gain impact: Moderate       | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | [VENT A] [VENT B] Charges: ●○○   | |
| |----------------------------------------| | | Plan vents to protect build pace  | |
| | MILESTONES                             | | +----------------------------------+ |
| | [x] Anchor Frame [x] Core Sync         | |                                      |
| | [>] Stabilizer Array [ ] Activation    | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Use vent capacity to sustain output and construction momentum."   |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Achieve tier goals while managing Temporal Flux generated by Time Egg production.
- **Core loop:**
  1. Increase Time Egg production to progress goals.
  2. Monitor Temporal Flux accumulation and its suppressive effects.
  3. Use limited venting opportunities/methods to reduce pressure at key moments.
  4. Balance growth against the risk of hitting flux capacity.
- **Gimmick behavior:**
  - More Time Egg production increases flux buildup.
  - Flux reduces egg production and chicken gain progressively toward zero as capacity is approached/reached.
  - A limited number of vents per run (methods not fully specified) provide critical relief.
- **Tier progression (high level):**
  - **Tier 1:** Learn the production-vs-flux tradeoff and complete a manageable goal with limited venting needs.
  - **Tier 2:** Tighter margins requiring planned vent timing and controlled growth.
  - **Tier 3:** High-pressure optimization where mistimed production spikes can stall the run.
- **Key player decisions:** When to push production, when to hold back, and when to spend scarce vent actions.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Ravnar harvester while the flux mechanic remains active.
- **Core loop extension:**
  1. Generate progress/resources under flux constraints.
  2. Allocate **eggs, chickens, and money** to harvester funding/construction goals.
  3. Use venting strategically to protect both operational output and build momentum.
- **Harvester design intent:** A temporal stabilization/extraction structure that benefits from sustained operation despite flux pressure, with persistence across Ascension tied to harvester tier.
- **Tier progression (high level):**
  - **Tier 4:** Establish baseline harvester systems; preserves Tier 1 Regular progress.
  - **Tier 5:** Expanded build requiring longer stability windows and better flux planning.
  - **Tier 6:** Full harvester completion preserving all Regular tiers; demands mastery of flux-limited throughput.
- **Key tension:** Spending vent capacity/resources for immediate throughput vs. securing long-term harvester milestones.

---

## 4.3 Xylok — Peace
**Theme:** Slow, low-cost progression where chickens come from deliberate hatching choices.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  XYLOK // PEACE            Regular Tier 1        Pace: SLOW/STEADY|
| [Gimmick Help] [No Automation Active]                                            |
+----------------------------------------------------------------------------------+
| Resources: Peace Eggs: #### | Chickens: #### | Money: #### | Prices: Low         |
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach peaceful growth target / sustain hatch strategy             |
| [==============>-----------------------------] 41%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Deliberate Hatching                                      |
|  +----------------------------------+   +------------------------------------+  |
|  | EGG INVENTORY                    |   | HATCHING DECISION                  |  |
|  | Available Peace Eggs: ####       |   | Choose eggs to hatch now:          |  |
|  | Egg Value: Low / Stable          |   | [ - ][##][ + ]                     |  |
|  | Purchase costs: Low              |   | Outcome preview: +## chickens      |  |
|  +----------------------------------+   | [HATCH SELECTED EGGS]              |  |
|                                         | No auto/internal/click hatch       |  |
|                                         +------------------------------------+  |
|  Pace Indicator: Slow & steady | Guidance: plan batches, avoid waste              |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Chickens are produced only by choosing to hatch eggs."           |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  XYLOK // PEACE      Harvester Build T4 (Tier 1)  Pace: SLOW      |
| [Gimmick Help] [Build Details] [No Automation] [Persistence: T1 on completion]   |
+----------------------------------------------------------------------------------+
| Resources: Peace Eggs: #### | Chickens: #### | Money: #### | Prices: Low         |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Sanctuary Foundation                                 Build: 29%       |
| [===========>----------------------------------]                                  |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | DELIBERATE HATCHING              | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | Available Eggs: ####             | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | Hatch now: [ - ][##][ + ]        | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | [HATCH SELECTED EGGS]            | |
| |----------------------------------------| | | Manual choice only               | |
| | MILESTONES                             | | +----------------------------------+ |
| | [>] Foundation  [ ] Grove Frame        | |                                      |
| | [ ] Canopy Link [ ] Activation         | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Reserve enough eggs/chickens for steady contributions over time."|
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Progress through deliberate, slower-paced planning centered on manual hatch decisions.
- **Core loop:**
  1. Accumulate Peace Eggs in a low-price, low-pressure economy.
  2. Decide when and how many eggs to convert into chickens via explicit hatch actions.
  3. Use resulting growth to meet tier goals without relying on automatic hatching systems.
- **Gimmick behavior:**
  - Peace Eggs have low prices; overall pace is intentionally slower.
  - Chickens are produced only by player-chosen hatching actions (not internal hatcheries or click-to-hatch mechanics).
- **Tier progression (high level):**
  - **Tier 1:** Establish a stable hatch rhythm and meet a foundational goal; grants base foothold.
  - **Tier 2:** Larger goals requiring better batching/timing and resource patience.
  - **Tier 3:** Highest planning demand, rewarding consistent, efficient hatch choices over burst tactics.
- **Key player decisions:** Batch size, timing of hatches, and balancing egg retention vs. chicken growth.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Fund/build a Xylok harvester while preserving the deliberate hatching constraint.
- **Core loop extension:**
  1. Continue intentional hatch planning to sustain chickens/resources.
  2. Contribute **eggs, chickens, and money** to harvester construction/funding goals.
  3. Balance peaceful growth cadence with long-term build investment.
- **Harvester design intent:** A cultivation/sanctuary-style harvester that grows through steady contributions rather than rapid automation, with Ascension persistence by harvester tier.
- **Tier progression (high level):**
  - **Tier 4:** Foundational harvester build; preserves Tier 1 Regular progress.
  - **Tier 5:** Increased funding/build demands requiring sustained planning over longer horizons.
  - **Tier 6:** Full harvester completion preserving all Regular tiers.
- **Key tension:** Immediate progression from hatching choices vs. reserving resources for harvester milestones.

---

## 4.4 Triton — Darkness
**Theme:** Maintain balance between light and abyss; both extremes are dangerous.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  TRITON // DARKNESS        Regular Tier 3       Balance: STABLE   |
| [Gimmick Help] [Risk: Low]                                                       |
+----------------------------------------------------------------------------------+
| Resources: Abyssal Eggs: #### | Chickens: #### | Egg Value: #### | Light: ##%    |
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Maintain stability and reach value/production target             |
| [=======================>--------------------] 68%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Darkness Balance                                         |
|  +----------------------------------+   +------------------------------------+  |
|  | LIGHT BALANCE METER              |   | CONTROL LEVERS                     |  |
|  | Too Dark < [====|====] > Too Bright|  | Use Abyssal Eggs to balance light: |  |
|  | Current zone: STABLE             |   | [ - ][##][ + ]  [APPLY BALANCE]    |  |
|  | Light output: ##                 |   | Adjustment options: ...            |  |
|  +----------------------------------+   +------------------------------------+  |
|  Status: Too bright -> collapse/chicken loss | Too dark -> egg value crash       |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Balance preserves both flock survival and egg value."             |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  TRITON // DARKNESS  Harvester Build T6 (Tier 3)  Balance: WATCH  |
| [Gimmick Help] [Build Details] [Risk: Moderate] [Persistence: All Regular tiers] |
+----------------------------------------------------------------------------------+
| Resources: Abyssal Eggs: #### | Chickens: #### | Money: #### | Light: ##%        |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Containment Core Activation                          Build: 76%       |
| [==============================>-----------]                                      |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | DARKNESS BALANCE                 | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | Too Dark < [===|=====] > Bright  | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | Zone: WATCH   Light: ##%         | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | [APPLY BALANCE] Eggs: [##]       | |
| |----------------------------------------| | | Protect flock/value during build  | |
| | MILESTONES                             | | +----------------------------------+ |
| | [x] Shell  [x] Conduits [>] Core       | |                                      |
| | [ ] Seal & Activation                  | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Do not starve balance controls while funding construction."       |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Keep the system in a viable balance band while progressing tier goals.
- **Core loop:**
  1. Produce/manage Abyssal Eggs and related outputs.
  2. Use Abyssal Eggs to balance light output.
  3. Maintain stability to protect chickens and preserve egg value.
  4. Push toward tier targets without tipping into collapse or devaluation.
- **Gimmick behavior:**
  - **Too much light:** Run collapses; abyssal chickens die/are lost in proportion to light level.
  - **Too little light:** Abyssal egg value drops sharply.
  - **Balanced:** Production and egg value remain stable.
- **Tier progression (high level):**
  - **Tier 1:** Learn safe balance range and complete a basic stability goal.
  - **Tier 2:** Higher targets with narrower tolerance for imbalance.
  - **Tier 3:** Sustained high performance under continuous balance pressure.
- **Key player decisions:** How aggressively to spend/use eggs for balancing, and when to prioritize stability over growth.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Construct/fund a Triton harvester while maintaining darkness-light equilibrium.
- **Core loop extension:**
  1. Operate within balance constraints to avoid losses/value crashes.
  2. Allocate **eggs, chickens, and money** to harvester funding/build goals.
  3. Invest in sustained stability that supports both ongoing output and harvester progress.
- **Harvester design intent:** A containment/extraction harvester engineered to operate in controlled darkness, with persistence across Ascension tied to harvester tier.
- **Tier progression (high level):**
  - **Tier 4:** Establish core harvester structure; preserves Tier 1 Regular progress.
  - **Tier 5:** Expanded build requiring longer periods of stable balance.
  - **Tier 6:** Full harvester completion preserving all Regular tiers.
- **Key tension:** Using abyssal resources for immediate balance/survival vs. committing them to harvester construction.

---

## 4.5 Hereth — Lava
**Theme:** Industrial conversion and market manipulation with economic risk.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  HERETH // LAVA            Regular Tier 2      Market: VOLATILE   |
| [Gimmick Help] [Devaluation Risk: Medium]                                        |
+----------------------------------------------------------------------------------+
| Resources: Lava Eggs: #### | Money: #### | Materials: A/B/C... | Market Health: ##|
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach portfolio/funding target without monetary devaluation       |
| [================>---------------------------] 49%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Materials & Market Board                                 |
|  +-----------------------------+   +-------------------------------------------+  |
|  | CONVERSION / PRODUCTION     |   | MARKET INDICES                            |  |
|  | Convert Lava Eggs ->        |   | Index A: [^^^^^-----] Price ##  Vol ##    |  |
|  | [Material A] [Material B]   |   | Index B: [^^^-------] Price ##  Vol ##    |  |
|  | Output preview: +##         |   | Index C: [^^^^^^----] Price ##  Vol ##    |  |
|  | [CONVERT]                   |   | [SELL EGGS] [BUY/STOCK]                   |  |
|  +-----------------------------+   | Influence: saturate / desaturate indices  |  |
|                                    +-------------------------------------------+  |
|  Warning: Bottomed market => monetary devaluation                                 |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Manipulate indices carefully; crashing value undermines progress."|
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  HERETH // LAVA      Harvester Build T5 (Tier 2)  Market: CAUTION |
| [Gimmick Help] [Build Details] [Devaluation Risk: High] [Persistence track]      |
+----------------------------------------------------------------------------------+
| Resources: Lava Eggs: #### | Chickens: #### | Money: #### | Market Health: ##   |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Processing Rig & Smelter Link                        Build: 44%       |
| [=================>----------------------------]                                  |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | MATERIALS & MARKET               | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | Convert -> Materials [CONVERT]   | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | Indices A/B/C: price & volume    | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | [SELL EGGS] [BUY/STOCK]          | |
| |----------------------------------------| | | Avoid devaluation while funding   | |
| | MILESTONES                             | | +----------------------------------+ |
| | [x] Excavation [>] Rig Assembly        | |                                      |
| | [ ] Smelter Link [ ] Activation        | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Market crashes can drain funding capacity needed for milestones." |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Convert Lava Eggs into materials and manipulate resource-linked indices to achieve tier goals while avoiding economic collapse.
- **Core loop:**
  1. Produce Lava Eggs and convert them into different raw materials.
  2. Sell Lava Eggs for money and purchase/position stock/resources.
  3. Influence a simulated market by oversaturating or desaturating resource-based indices.
  4. Extract value/progress toward goals without bottoming out the market.
- **Gimmick behavior:**
  - Market manipulation is a core tool, but excessive imbalance can bottom out the market.
  - Bottoming out results in **monetary devaluation**, harming progress/economy.
- **Tier progression (high level):**
  - **Tier 1:** Learn conversion and basic market influence; reach an initial target safely.
  - **Tier 2:** More complex targets requiring multi-index awareness and timing.
  - **Tier 3:** High-stakes optimization where aggressive manipulation can backfire into devaluation.
- **Key player decisions:** What to convert, when to sell/buy, which indices to influence, and how hard to push before instability.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Hereth harvester on top of ongoing industrial-market gameplay.
- **Core loop extension:**
  1. Run conversion and market operations to generate resources/money.
  2. Feed **eggs, chickens, and money** into harvester funding/construction.
  3. Manage market health so funding pipelines remain viable over time.
- **Harvester design intent:** An industrial extraction and processing harvester financed through volatile market operations, with persistence across Ascension tied to harvester tier.
- **Tier progression (high level):**
  - **Tier 4:** Establish harvester base infrastructure; preserves Tier 1 Regular progress.
  - **Tier 5:** Larger capital/build requirements, increasing exposure to market risk.
  - **Tier 6:** Full harvester completion preserving all Regular tiers; requires robust economic management.
- **Key tension:** Maximizing short-term market gains for funding vs. preserving long-term monetary stability.

---

## 4.6 Malak — Light
**Theme:** Grow a radiant Orb's influence by feeding Light Eggs, balancing value growth against scaling cost and decay.

### UI Wireframe — Regular Eggspedition
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  MALAK // LIGHT            Regular Tier 2       Orb: RISING       |
| [Gimmick Help] [Decay: None / Warning]                                           |
+----------------------------------------------------------------------------------+
| Resources: Light Eggs: #### | Money: #### | Orb Influence: ## | Orb Value: ####  |
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Expand Orb influence/value to target threshold                   |
| [====================>-----------------------] 58%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick Module: Orb Growth & Decay                                       |
|  +----------------------------------+   +------------------------------------+  |
|  | THE ORB                          |   | FEED / SELL DECISIONS              |  |
|  |        .-""""-.                  |   | Feed Light Eggs to Orb:            |  |
|  |       /  ORB   \   Influence: ## |   | [ - ][##][ + ]  [FEED ORB]         |  |
|  |      |  Value ## |  Radius:  ##  |   | Feed cost (scales): ## eggs        |  |
|  |       \        /   Decay: warn   |   |                                    |  |
|  |        '-....-'                  |   | Sell Light Eggs for money:         |  |
|  +----------------------------------+   | [SELL ##]  Gain: $##               |  |
|                                         +------------------------------------+  |
|  Trend: Influence rising/falling | Scaling cost indicator | Decay state/timer     |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Feeding increases influence/value; neglect may allow decay."      |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
+----------------------------------------------------------------------------------+
| PLANET-ONLY HEADER (replaces global header)                                      |
| [< Planet Map]  MALAK // LIGHT      Harvester Build T4 (Tier 1)  Orb: STABLE     |
| [Gimmick Help] [Build Details] [Decay: Warning] [Persistence: T1 on completion]  |
+----------------------------------------------------------------------------------+
| Resources: Light Eggs: #### | Chickens: #### | Money: #### | Orb Influence: ##   |
+----------------------------------------------------------------------------------+
| Construction / Funding Goal                                                       |
| Milestone: Radiant Collector Frame                              Build: 33%       |
| [============>---------------------------------]                                  |
| Required this milestone: Eggs #### | Chickens #### | Money ####                   |
+----------------------------------------------------------------------------------+
| Harvester Construction Module              | Primary Gimmick Module              |
| +----------------------------------------+ | +----------------------------------+ |
| | CONTRIBUTIONS                          | | | ORB GROWTH & DECAY               | |
| | Feed Eggs:     [ - ][##][ + ] [FEED]   | | | Influence: ##  Value: ####       | |
| | Feed Chickens: [ - ][##][ + ] [FEED]   | | | Feed Orb: [ - ][##][ + ] [FEED]  | |
| | Fund Money:    [ - ][##][ + ] [FUND]   | | | Sell Eggs: [SELL ##] -> $##      | |
| |----------------------------------------| | | Scaling cost / Decay warning     | |
| | MILESTONES                             | | +----------------------------------+ |
| | [>] Collector Frame [ ] Lens Array     | |                                      |
| | [ ] Amplifier Core  [ ] Activation     | |                                      |
| +----------------------------------------+                                      |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Sustain the Orb to support output while funding construction."    |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Scale the Orb's sphere of influence and/or value to meet tier goals by choosing between feeding and selling Light Eggs.
- **Core loop:**
  1. Produce/acquire Light Eggs.
  2. Choose to **feed** eggs to the Orb (grow influence/value) or **sell** eggs for money.
  3. Manage increasing feed costs and potential decay over time.
  4. Reach tier thresholds before efficiency is lost.
- **Gimmick behavior:**
  - Feeding Light Eggs expands the Orb's sphere of influence and can increase its value.
  - Orb feed/egg cost scales upward.
  - The Orb may decay over time, pressuring sustained engagement/investment.
- **Tier progression (high level):**
  - **Tier 1:** Establish initial Orb growth and understand feed-vs-sell tradeoffs.
  - **Tier 2:** Higher influence/value targets with more pronounced scaling/decay pressure.
  - **Tier 3:** Demanding sustainment challenge requiring efficient long-term Orb upkeep.
- **Key player decisions:** Feed amount/timing, cash-out (sell) timing, and how to respond to scaling costs and decay.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Malak harvester while maintaining Orb growth dynamics.
- **Core loop extension:**
  1. Continue feeding/selling decisions to sustain economy and Orb state.
  2. Contribute **eggs, chickens, and money** to harvester funding/construction goals.
  3. Prevent decay/setbacks from undermining long-term harvester investment.
- **Harvester design intent:** A light-harvesting construct amplified by the Orb, where sustained radiance/influence supports buildout and persists across Ascension by harvester tier.
- **Tier progression (high level):**
  - **Tier 4:** Establish foundational harvester build; preserves Tier 1 Regular progress.
  - **Tier 5:** Expanded build requiring consistent Orb upkeep and funding throughput.
  - **Tier 6:** Full harvester completion preserving all Regular tiers.
- **Key tension:** Investing eggs into Orb growth for performance vs. diverting resources into harvester construction and guarding against decay.

---

## 5. Cross-Cutting UI and Player Feedback Requirements

### 5.1 Planet-Only Header (During Eggspeditions)
- Replaces the standard global header for the duration of an active Eggspedition session.
- Must always communicate: return-to-map navigation, planet identity/theme, current mode and tier, and a compact high-priority planet status.
- May include quick access to gimmick help/build details without reintroducing the full global header.

### 5.2 Consistent Information Across All Planets
- Clear primary objective and progress visualization (tier goal or construction/funding goal).
- Resource inventory relevant to both core and planet-specific mechanics.
- Primary gimmick module with plain-language state and risk labels.
- Harvester mode additionally shows construction contributions, milestone progress, and persistence outcome.

### 5.3 Planet-Specific Feedback Priorities
- **Arcturus:** Fuel availability, power state, and money generation clarity.
- **Ravnar:** Flux level, suppression impact, and vent availability/urgency.
- **Xylok:** Explicit hatch action affordance and confirmation of no automation.
- **Triton:** Balance zone readability and immediate consequences of drift.
- **Hereth:** Index movement, saturation effects, and devaluation warnings.
- **Malak:** Orb growth state, scaling cost visibility, and decay warnings.

### 5.4 Completion, Persistence, and Return Flow
- On tier or milestone completion: show rewards/unlocks/build progress, updated progression state, and next available action (next tier, next milestone, harvester build, or return to map).
- On failure/collapse states (where applicable): clearly communicate cause, losses/impact scope, and retry options within mode rules.
- In Harvester mode: surface current build tier, funded milestones, contribution totals by resource type, and what progress will persist through Ascension.

---

## 6. Design Notes and Intent
- Each planet should feel mechanically distinct while sharing a common challenge structure and UI language.
- Regular Eggspeditions teach and test mastery of a planet's gimmick in bounded tiers.
- Harvester Eggspeditions transform mastered gimmicks into longer-horizon investment problems with persistent payoff, combining construction/funding pressure with the planet's core system.
- Where source details are unspecified (e.g., exact vent methods, precise formulas, specific reward types, exact material/index names), this document defines the intended player-facing behavior and design role, leaving numerical tuning and implementation details to development.
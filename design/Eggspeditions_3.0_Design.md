# Eggspeditions 3.0 — Design Document

## 1. Purpose and Source
This document expands on `design/eggspeditionsDesign.md` into a high-level design for Eggspeditions 3.0. It defines the shared structure, system interactions, UI wireframes, and per-planet designs for both Regular (post-prestige) and Harvester (post-ascension) Eggspeditions.

This document is intentionally implementation-agnostic: it describes behavior, structure, and player-facing flows without prescribing code or pseudocode.

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
   - During an active Eggspedition, the **Planet-Only Header replaces the standard global (farm) header**.
   - Renders the session body below the header: goals/progress, resource details as needed, primary gimmick module, harvester construction module (in harvester mode), and alerts/feedback.
   - Surfaces threshold risks and outcome states clearly.

### 3.2 How Planets Interact
- **Isolation with meta links:** Each planet runs as a self-contained challenge context with its own rules and local state, but interacts with the meta layer through:
  - **Discovery gating** (Soul Egg cost, unlock state).
  - **Tier completion outputs** (rewards and progression flags).
  - **Harvester persistence** (post-ascension state retained according to harvester tier/build progress).
  - **Starting foothold** granted after Tier 1 to ease re-entry/further tiers.
- **No direct cross-planet simulation dependency:** Planet gimmick systems operate within the active planet session and do not require simultaneous simulation of other planets.
- **Shared player understanding, distinct mechanics:** A common UI grammar (planet-only header, goal/progress area, resource displays, gimmick module, alerts) helps players transfer knowledge while each planet's central mechanic remains unique.

### 3.3 Content Rendering and UI Composition

#### Planet-Only Header (replaces standard global header)
The planet-only header occupies the same top-of-screen header region and follows the same compact, horizontal, centered layout conventions as the current global farm header component. It is a **single header bar** (not a multi-panel container) that may include:
- **Planet identity:** Planet image/icon and/or planet name/theme label.
- **Session context:** Current mode and tier (e.g., Regular T1–T3, Harvester T4–T6).
- **Key values/status:** Compact display of the most critical session currencies/states (as appropriate for the planet/mode).
- **Context actions:** Session-relevant actions (e.g., return to Eggspeditions/planet map, help/info). No standard farm actions (promote/prestige/ascend) appear here.

The standard global header is not shown concurrently during an Eggspedition.

#### Session Body (below header)
- **Goal/Progress panel:** Regular tier objective or Harvester construction/funding objective with progress visualization.
- **Resource summary/details:** Eggs, chickens, money, and planet-specific currencies/meters needed for the current mode.
- **Primary Gimmick module:** Planet-specific visualization and controls driven by session state.
- **Harvester Construction module (Harvester mode only):** Contribution controls (eggs, chickens, money), milestone/build progress, and persistence summary.
- **Alerts & feedback:** Contextual warnings, thresholds, completion/failure messaging, and next actions.

#### State-driven rendering
- UI reflects current mode/tier, goal progress, resource changes, gimmick risk states, and construction state.
- On completion/failure transitions, the view presents results and valid next steps (retry, advance tier/milestone, continue/build harvester, return to map) per mode rules.

### 3.4 Regular vs. Harvester Mode Relationship
- **Regular:** Focused on mastering the planet gimmick to meet tiered challenge goals and earn tiered rewards.
- **Harvester:** Preserves a foundation of planetary progress and shifts emphasis to long-term buildout/funding while retaining the core gimmick as an ongoing constraint/opportunity.
- **Harvester construction model:**
  - Standard goals are replaced/augmented by **funding and construction goals**.
  - Players feed **eggs, chickens, and money** into harvester construction alongside managing the planet gimmick.
  - Construction milestones define build progress and persistence outcomes.
- **Persistence rule (high level):** Harvester construction milestones determine how much planetary challenge progress is retained through Ascension (Tier 1 harvester preserves Tier 1 challenge progress; Tier 3 preserves all challenge tiers, etc., as specified).

---

## 4. Planet Designs

## 4.1 Arcturus — Energy
**Theme:** Dark Energy Eggs fuel production equipment to make money.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Arcturus (Energy)  |  Regular T1  |  Eggs: ####  Money: $####    |
| Power: ####  +$##/s  |  [Back to Map] [Help]                                     |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Earn $X total / Sustain Y output                                 |
| [=====================>---------------------] 62%                                 |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Power Generation & Burn Control                                  |
| +-------------------------------+  +-------------------------------------------+  |
| | Fuel Input                    |  | Production Equipment                      |  |
| | Dark Energy Eggs available:## |  | Status: Online / Idle / Low Fuel          |  |
| | Burn amount: [ - ][##][ + ]   |  | Output: +$##/s    Efficiency: ##%         |  |
| | Burn rate: [Low|Med|High]     |  | Equipment options: [View/Adjust]          |  |
| | [Burn Eggs]  Reserve: [ ] min |  |                                           |  |
| +-------------------------------+  +-------------------------------------------+  |
| Power Flow: [Eggs] -> [Burn/Power] -> [Money Output]                             |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Money is generated from powered equipment, not eggs directly."   |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Arcturus (Energy)  |  Harvester T4 (Build 1)  |  Eggs: ####        |
| Chickens: ####  Money: $####  Power: ####  |  [Back to Map] [Help]               |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Foundational Harvester Core                 Build Progress: 38%       |
| [==============>-------------------------------]                                  |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence on completion: Regular Tier 1 progress retained                      |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Power Generation         |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | Burn: [ - ][##][ + ]     |  |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | [Burn Eggs] +$##/s       |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | Status: Online/Low Fuel  |  |
| |---------------------------------------------| | | Fuel supports income for |  |
| | Milestones                                  | | | ongoing construction     |  |
| | [x] Site Prep      [>] Core Assembly        | | +--------------------------+  |
| | [ ] Grid Link      [ ] Activation           | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Balance fuel burn for income with contributions to construction."|
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Build and operate an energy-to-money pipeline by burning Dark Energy Eggs to power production equipment.
- **Core loop:** Accumulate Dark Energy Eggs -> allocate/burn eggs for power -> powered equipment generates money/output -> reinvest/adjust to meet tier targets.
- **Tier progression (high level):**
  - **Tier 1:** Establish a basic burn-to-power-to-money chain and reach an initial threshold; grants base foothold materials/resources.
  - **Tier 2:** Higher output/efficiency targets requiring better allocation and sustained operation.
  - **Tier 3:** Most demanding targets emphasizing optimized fuel management and production stability.
- **Key player decisions:** Burn amount/rate, fuel reserves, timing of allocation, and throughput vs. stability.
- **Pressure:** Insufficient fueling stalls progress; poor allocation slows goal completion.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Goals become **harvester funding and construction** goals while the energy gimmick remains active.
- **Core loop extension:** Burn eggs to generate money/capacity -> contribute **eggs, chickens, and money** to milestones -> maintain production while building.
- **Harvester intent:** A planetary energy-extraction installation that scales with investment and preserves Arcturus progress across Ascension based on harvester tier.
- **Tier progression (high level):**
  - **Tier 4 (Build 1):** Foundational infrastructure; preserves Tier 1 Regular progress.
  - **Tier 5:** Expanded capacity/funding; deeper persistence/buildout.
  - **Tier 6 (Build 3):** Full harvester completion; preserves all Regular tiers on Arcturus.
- **Key tension:** Short-term power/money efficiency vs. long-term harvester investment.

---

## 4.2 Ravnar — Time
**Theme:** Temporal Flux builds up from Time Egg production and suppresses progress if unmanaged.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Ravnar (Time)  |  Regular T2  |  Eggs: ####  Chickens: ####       |
| Flux: 71% (Rising)  Vents: ● ● ○  |  [Back to Map] [Help]                        |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach target output/progress before instability lockup            |
| [==================>-------------------------] 54%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Temporal Flux Management                                        |
| +------------------------------------+  +-------------------------------------+  |
| | Temporal Flux                      |  | Venting / Control                   |  |
| | Capacity: [##########-----] 71%    |  | Vent Charges: ● ● ○ (limited)       |  |
| | Effect: Prod ##%  Chicken Gain ##% |  | [Vent Method A]  [Vent Method B]    |  |
| | At 100%: production/gain -> 0      |  | Effect preview: -##% flux           |  |
| | Trend: Rising / Falling / Stable   |  | Availability/Cooldown: ...          |  |
| +------------------------------------+  +-------------------------------------+  |
| Production context: Time Egg rate, projected flux growth, safe operating window  |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Higher Time Egg output increases Temporal Flux pressure."         |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Ravnar (Time)  |  Harvester T5 (Build 2)  |  Eggs: ####           |
| Chickens: ####  Money: $####  Flux: 48%  Vents: ● ○ ○  |  [Back to Map] [Help]  |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Stabilization Array Expansion               Build Progress: 51%       |
| [====================>-------------------------]                                  |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence track: advanced harvester build progress retained by build tier       |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Temporal Flux            |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | [########-----------] 48%|  |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | Prod/Gain impact: ##%    |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | [Vent A] [Vent B] ● ○ ○  |  |
| |---------------------------------------------| | | Protect output + build   |  |
| | Milestones                                  | | +--------------------------+  |
| | [x] Anchor Frame   [x] Core Sync            | |                               |
| | [>] Stabilizer     [ ] Activation           | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Use vent capacity to sustain output and construction momentum."   |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Achieve tier goals while managing Temporal Flux generated by Time Egg production.
- **Core loop:** Increase Time Egg production -> monitor flux accumulation/suppression -> use limited vents at key moments -> balance growth vs. capacity risk.
- **Gimmick behavior:** Flux rises with Time Egg production; reduces egg production and chicken gain progressively toward zero near/at capacity. Limited vents per run provide critical relief (methods unspecified).
- **Tier progression (high level):** T1 learn tradeoff; T2 tighter planned vent timing; T3 high-pressure optimization.
- **Key player decisions:** When to push production, when to hold back, and when to spend scarce vent actions.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Ravnar harvester while flux remains active.
- **Core loop extension:** Generate resources under flux constraints -> contribute **eggs, chickens, and money** -> vent strategically to protect output and build momentum.
- **Harvester intent:** Temporal stabilization/extraction structure benefiting from sustained operation, with persistence tied to harvester tier.
- **Tier progression (high level):** T4 baseline (preserves T1 Regular); T5 longer stability windows; T6 full completion (preserves all Regular tiers).
- **Key tension:** Vent/resource use for immediate throughput vs. long-term harvester milestones.

---

## 4.3 Xylok — Peace
**Theme:** Slow, low-cost progression where chickens come from deliberate hatching choices.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Xylok (Peace)  |  Regular T1  |  Eggs: ####  Chickens: ####       |
| Money: $####  Pace: Slow  (No Automation)  |  [Back to Map] [Help]               |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach peaceful growth target / sustain hatch strategy             |
| [==============>-----------------------------] 41%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Deliberate Hatching                                             |
| +------------------------------------+  +-------------------------------------+  |
| | Egg Inventory                      |  | Hatching Decision                   |  |
| | Available Peace Eggs: ####         |  | Hatch now: [ - ][##][ + ]           |  |
| | Egg value: Low / Stable            |  | Outcome preview: +## chickens       |  |
| | Costs: Low                         |  | [Hatch Selected Eggs]               |  |
| |                                    |  | No auto/internal/click hatch        |  |
| +------------------------------------+  +-------------------------------------+  |
| Pace guidance: Slow & steady; plan batches and avoid waste                       |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Chickens are produced only by choosing to hatch eggs."           |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Xylok (Peace)  |  Harvester T4 (Build 1)  |  Eggs: ####           |
| Chickens: ####  Money: $####  Pace: Slow (No Automation)  |  [Back to Map] [Help]|
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Sanctuary Foundation                        Build Progress: 29%       |
| [===========>----------------------------------]                                  |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence on completion: Regular Tier 1 progress retained                      |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Deliberate Hatching      |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | Available Eggs: ####     |  |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | Hatch: [ - ][##][ + ]    |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | [Hatch Selected Eggs]    |  |
| |---------------------------------------------| | | Manual choice only       |  |
| | Milestones                                  | | +--------------------------+  |
| | [>] Foundation     [ ] Grove Frame          | |                               |
| | [ ] Canopy Link    [ ] Activation           | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Reserve enough eggs/chickens for steady contributions over time."|
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Progress through deliberate, slower-paced planning centered on manual hatch decisions.
- **Core loop:** Accumulate Peace Eggs -> choose when/how many to hatch -> convert to chickens by explicit action -> meet tier goals without automation.
- **Gimmick behavior:** Low prices, intentionally slow pace; chickens come only from player-chosen hatching actions.
- **Tier progression (high level):** T1 stable rhythm; T2 better batching/timing; T3 consistent efficient hatch planning.
- **Key player decisions:** Batch size, timing, and egg retention vs. chicken growth.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Fund/build a Xylok harvester while preserving the deliberate hatching constraint.
- **Core loop extension:** Continue intentional hatching -> contribute **eggs, chickens, and money** -> balance peaceful cadence with long-term build investment.
- **Harvester intent:** Cultivation/sanctuary-style harvester built through steady contributions, with persistence by harvester tier.
- **Tier progression (high level):** T4 foundation (preserves T1); T5 sustained planning demands; T6 full completion (preserves all Regular tiers).
- **Key tension:** Immediate progression from hatches vs. reserving resources for milestones.

---

## 4.4 Triton — Darkness
**Theme:** Maintain balance between light and abyss; both extremes are dangerous.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Triton (Darkness)  |  Regular T3  |  Eggs: ####  Chickens: ####  |
| Egg Value: ####  Light: ##%  Balance: Stable  |  [Back to Map] [Help]            |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Maintain stability and reach value/production target             |
| [=======================>--------------------] 68%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Darkness Balance                                                |
| +------------------------------------+  +-------------------------------------+  |
| | Light Balance Meter                |  | Control Levers                      |  |
| | Too Dark < [====|====] > Too Bright|  | Abyssal Eggs to balance:            |  |
| | Current zone: Stable               |  | [ - ][##][ + ]  [Apply Balance]     |  |
| | Light output: ##                   |  | Adjustment options: ...             |  |
| +------------------------------------+  +-------------------------------------+  |
| Risk states: Too bright -> collapse/chicken loss | Too dark -> egg value crash   |
| Balanced -> stable production and egg value                                       |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Balance preserves both flock survival and egg value."             |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Triton (Darkness)  |  Harvester T6 (Build 3)  |  Eggs: ####      |
| Chickens: ####  Money: $####  Light: ##%  Balance: Watch  |  [Back to Map] [Help]|
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Containment Core Activation                 Build Progress: 76%       |
| [==============================>-----------]                                      |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence on completion: All Regular tier progress retained                    |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Darkness Balance         |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | Too Dark<[===|=====]>Bright| |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | Zone: Watch  Light: ##%  |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | [Apply Balance]          |  |
| |---------------------------------------------| | | Protect flock & value    |  |
| | Milestones                                  | | +--------------------------+  |
| | [x] Shell    [x] Conduits   [>] Core        | |                               |
| | [ ] Seal & Activation                       | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Do not starve balance controls while funding construction."       |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Keep the system in a viable balance band while progressing tier goals.
- **Core loop:** Produce/manage Abyssal Eggs -> use eggs to balance light output -> maintain stability to protect chickens and egg value -> push toward targets.
- **Gimmick behavior:** Too much light causes collapse/chicken losses scaling with light; too little collapses egg value; balanced state preserves production and value.
- **Tier progression (high level):** T1 learn safe range; T2 narrower tolerance; T3 sustained high performance under pressure.
- **Key player decisions:** How aggressively to spend eggs on balancing vs. prioritizing growth.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Construct/fund a Triton harvester while maintaining darkness-light equilibrium.
- **Core loop extension:** Operate within balance constraints -> contribute **eggs, chickens, and money** -> sustain stability to support output and harvester progress.
- **Harvester intent:** Containment/extraction harvester engineered for controlled darkness, with persistence tied to harvester tier.
- **Tier progression (high level):** T4 core structure (preserves T1); T5 longer stability periods; T6 full completion (preserves all Regular tiers).
- **Key tension:** Resources for immediate balance/survival vs. harvester construction.

---

## 4.5 Hereth — Lava
**Theme:** Industrial conversion and market manipulation with economic risk.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Hereth (Lava)  |  Regular T2  |  Eggs: ####  Money: $####        |
| Materials: A/B/C  Market Health: ## (Volatile)  |  [Back to Map] [Help]          |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Reach portfolio/funding target without monetary devaluation       |
| [================>---------------------------] 49%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Materials & Market Board                                        |
| +--------------------------------+  +-----------------------------------------+  |
| | Conversion / Production        |  | Market Indices                          |  |
| | Convert Lava Eggs -> Materials |  | Index A: [^^^^^-----] Price ## Vol ##   |  |
| | [Material A] [Material B] ...  |  | Index B: [^^^-------] Price ## Vol ##   |  |
| | Output preview: +##            |  | Index C: [^^^^^^----] Price ## Vol ##   |  |
| | [Convert]                      |  | [Sell Eggs] [Buy/Stock]                 |  |
| |                                |  | Influence: saturate / desaturate        |  |
| +--------------------------------+  +-----------------------------------------+  |
| Warning: Bottomed market => monetary devaluation                                 |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Manipulate indices carefully; crashing value undermines progress."|
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Hereth (Lava)  |  Harvester T5 (Build 2)  |  Eggs: ####          |
| Chickens: ####  Money: $####  Market Health: ## (Caution)  |  [Back to Map] [Help]|
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Processing Rig & Smelter Link               Build Progress: 44%       |
| [=================>----------------------------]                                  |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence track: harvester build progress retained by build tier               |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Materials & Market       |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | Convert -> Materials     |  |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | Indices A/B/C: prices    |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | [Sell Eggs] [Buy/Stock]  |  |
| |---------------------------------------------| | | Avoid devaluation risk   |  |
| | Milestones                                  | | +--------------------------+  |
| | [x] Excavation     [>] Rig Assembly         | |                               |
| | [ ] Smelter Link   [ ] Activation           | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Market crashes can drain funding capacity needed for milestones." |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Convert Lava Eggs into materials and manipulate resource-linked indices to achieve tier goals while avoiding economic collapse.
- **Core loop:** Produce/convert Lava Eggs -> sell/buy/position via market -> influence indices by saturation/desaturation -> extract progress without bottoming out.
- **Gimmick behavior:** Market manipulation is powerful but risky; bottoming out causes **monetary devaluation**.
- **Tier progression (high level):** T1 basic conversion/influence; T2 multi-index timing; T3 high-stakes optimization.
- **Key player decisions:** What to convert, when to sell/buy, which indices to influence, and risk tolerance.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Hereth harvester on top of ongoing industrial-market gameplay.
- **Core loop extension:** Run conversions/market operations -> contribute **eggs, chickens, and money** -> maintain market health to sustain funding.
- **Harvester intent:** Industrial extraction/processing harvester financed through volatile operations, with persistence tied to harvester tier.
- **Tier progression (high level):** T4 base infrastructure (preserves T1); T5 larger capital exposure; T6 full completion (preserves all Regular tiers).
- **Key tension:** Short-term market gains for funding vs. long-term monetary stability.

---

## 4.6 Malak — Light
**Theme:** Grow a radiant Orb's influence by feeding Light Eggs, balancing value growth against scaling cost and decay.

### UI Wireframe — Regular Eggspedition
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Malak (Light)  |  Regular T2  |  Eggs: ####  Money: $####        |
| Orb Influence: ##  Value: ####  Decay: None/Warn  |  [Back to Map] [Help]        |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Goal / Progress                                                                  |
| Tier Objective: Expand Orb influence/value to target threshold                   |
| [====================>-----------------------] 58%                               |
+----------------------------------------------------------------------------------+
| Primary Gimmick: Orb Growth & Decay                                              |
| +------------------------------------+  +-------------------------------------+  |
| | The Orb                            |  | Feed / Sell Decisions               |  |
| | Influence: ##   Value: ####        |  | Feed Orb: [ - ][##][ + ] [Feed]     |  |
| | Radius/State: ##                   |  | Feed cost (scales): ## eggs         |  |
| | Trend: Rising/Falling              |  | Sell Eggs: [ - ][##][ + ] [Sell]    |  |
| | Decay: None / Warning              |  | Sell gain: $##                      |  |
| +------------------------------------+  +-------------------------------------+  |
| Indicators: scaling cost, decay state/timer, influence trend                     |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Feeding increases influence/value; neglect may allow decay."      |
+----------------------------------------------------------------------------------+
```

### UI Wireframe — Harvester Construction Challenge
```text
PLANET-ONLY HEADER (replaces global farm header; compact horizontal bar)
+----------------------------------------------------------------------------------+
| [Planet Img]  Malak (Light)  |  Harvester T4 (Build 1)  |  Eggs: ####          |
| Chickens: ####  Money: $####  Orb Influence: ##  Decay: Warn  |  [Back to Map]   |
+----------------------------------------------------------------------------------+

SESSION BODY
+----------------------------------------------------------------------------------+
| Harvester Construction / Funding Goal                                             |
| Milestone: Radiant Collector Frame                     Build Progress: 33%       |
| [============>---------------------------------]                                  |
| Milestone Needs: Eggs ####  Chickens ####  Money $####                           |
| Persistence on completion: Regular Tier 1 progress retained                      |
+----------------------------------------------------------------------------------+
| Harvester Construction                          | Primary Gimmick (active)       |
| +---------------------------------------------+ | +--------------------------+  |
| | Contribute Resources                        | | | Orb Growth & Decay       |  |
| | Eggs:     [ - ][##][ + ] [Contribute]       | | | Influence: ## Value: ####|  |
| | Chickens: [ - ][##][ + ] [Contribute]       | | | Feed Orb: [##] [Feed]    |  |
| | Money:    [ - ][##][ + ] [Fund]             | | | Sell Eggs: [##] [Sell]   |  |
| |---------------------------------------------| | | Scaling cost / Decay     |  |
| | Milestones                                  | | +--------------------------+  |
| | [>] Collector Frame   [ ] Lens Array        | |                               |
| | [ ] Amplifier Core    [ ] Activation        | |                               |
| +---------------------------------------------+                                |
+----------------------------------------------------------------------------------+
| Alerts & Tips: "Sustain the Orb to support output while funding construction."    |
+----------------------------------------------------------------------------------+
```

### Regular Eggspedition (Tiers 1–3)
- **Objective focus:** Scale the Orb's influence/value to meet tier goals by choosing between feeding and selling Light Eggs.
- **Core loop:** Acquire Light Eggs -> feed Orb (grow influence/value) or sell for money -> manage scaling feed costs and potential decay -> reach thresholds.
- **Gimmick behavior:** Feeding expands influence and can increase value; feed cost scales upward; Orb may decay over time.
- **Tier progression (high level):** T1 establish growth/tradeoffs; T2 stronger scaling/decay pressure; T3 sustained efficient upkeep.
- **Key player decisions:** Feed amount/timing, sell timing, and response to scaling/decay.

### Harvester Eggspedition (Tiers 4–6)
- **Mode shift:** Build/fund a Malak harvester while maintaining Orb growth dynamics.
- **Core loop extension:** Continue feed/sell decisions -> contribute **eggs, chickens, and money** -> prevent decay/setbacks from undermining build investment.
- **Harvester intent:** Light-harvesting construct amplified by the Orb, with persistence tied to harvester tier.
- **Tier progression (high level):** T4 foundation (preserves T1); T5 consistent upkeep/funding; T6 full completion (preserves all Regular tiers).
- **Key tension:** Investing eggs into Orb performance vs. diverting resources to construction while guarding against decay.

---

## 5. Cross-Cutting UI and Player Feedback Requirements

### 5.1 Planet-Only Header Alignment
- The Planet-Only Header **replaces** the standard global (farm) header during Eggspeditions and must align with the existing header component's placement and compact horizontal layout conventions.
- It is a header bar, not a content panel: identity, mode/tier, key values/status, and minimal session actions belong in the header; goals, detailed resources, gimmick controls, and construction modules belong in the session body below.
- Standard farm-specific actions and displays (e.g., promote/prestige/ascend flows) are not part of the Eggspedition header.

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
- On tier/milestone completion: show rewards/unlocks/build progress, updated progression state, and next available action (next tier, next milestone, harvester build, or return to map).
- On failure/collapse states (where applicable): clearly communicate cause, losses/impact scope, and retry options within mode rules.
- In Harvester mode: surface current build tier, funded milestones, contribution context, and what progress will persist through Ascension.

---

## 6. Design Notes and Intent
- Each planet should feel mechanically distinct while sharing a common challenge structure and UI language.
- Regular Eggspeditions teach and test mastery of a planet's gimmick in bounded tiers.
- Harvester Eggspeditions transform mastered gimmicks into longer-horizon investment problems with persistent payoff, combining construction/funding pressure with the planet's core system.
- Where source details are unspecified (e.g., exact vent methods, formulas, reward types, material/index names), this document defines intended player-facing behavior and design role, leaving numerical tuning and implementation details to development.
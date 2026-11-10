import { gameState } from "./DataManager.svelte"
import { eggs, promoteEgg } from "./EggManager"
import { commonByTier, commonResearch, purchaseCommonResearch } from "./ResearchManager"

// Egg indices used by the "Auto Promotion Stops At" setting
const universeEggIndex = eggs.findIndex((egg) => egg.name === "Universe")
const enlightenmentEggIndex = eggs.findIndex((egg) => egg.name === "Enlightenment")

// Common research indices covered by each research automator
const tierOneToFiveIndices = tierIndices(0, 4)
const tierSixToTenIndices = tierIndices(5, 9)
const tierElevenToFourteenIndices = tierIndices(10, 13)

// Collects the common research indices of every research within tiers [startTier, endTier]
function tierIndices(startTier, endTier) {
    const byTier = commonByTier()
    const indices = []
    for(let tier = startTier; tier <= endTier; tier++) {
        for(const research of byTier[tier] ?? []) {
            indices.push(commonResearch.indexOf(research))
        }
    }
    return indices
}

// Buys the maximum affordable levels of each research in the tier range
function autoBuyCommonResearch(indices) {
    for(const index of indices) {
        purchaseCommonResearch(index, { buyAmount: Infinity })
    }
}

function autoPromote() {
    const data = gameState.data
    // Same safety gates as the manual promote button
    if(data.indexValues.currentContract !== -1 || data.indexValues.currentPlanet !== -1) return
    // Auto Promotion Stops At: Enlightenment (toggle on) or Universe (toggle off)
    const stopIndex = data.settings.toggles[3] ? enlightenmentEggIndex : universeEggIndex
    if(data.indexValues.currentEgg >= stopIndex) return
    promoteEgg()
}

export function runAuto(index) {
    switch(index) {
        case 0: // Tier I-V
            autoBuyCommonResearch(tierOneToFiveIndices)
            break
        case 1: // Tier VI-X
            autoBuyCommonResearch(tierSixToTenIndices)
            break
        case 2: // Tier XI-XIV
            autoBuyCommonResearch(tierElevenToFourteenIndices)
            break
        case 3: // Promotion
            autoPromote()
            break
        case 4:
            break
        case 5:
            break
        case 6:
            break
    }
}

// Runs every active automator, called once per game tick
export function updateAutomation() {
    const automation = gameState.data.automation
    for(let i = 0; i < automation.commonAutomatorActive.length; i++) {
        if(automation.commonAutomatorActive[i]) runAuto(i)
    }
    if(automation.epicAutomatorActive[0]) runAuto(3)
}

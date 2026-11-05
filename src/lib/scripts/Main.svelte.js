import { unlockAchievements } from "./AchievementsManager"
import { updateContractPool } from "./ContractsManager"
import { gameState } from "./DataManager.svelte"
import { calculateEggValueBonus, calculateInternalHatchery, calculateLayRate, eggs } from "./EggManager"

let lastFrameTimestamp = null
let timeDiff= $state(0)

export function updateGameData(timeStamp) {
    requestAnimationFrame(updateGameData)

    const now = Date.now()

    if(lastFrameTimestamp === null) {
        timeDiff = Math.max(0, gameState.data.time-now) / 1000
    }
    else {
        timeDiff = Math.max(0,timeStamp-lastFrameTimestamp) / 1000
    }
    lastFrameTimestamp = timeStamp
    gameState.data.stats.timePlayed = gameState.data.stats.timePlayed.plus(timeDiff)
    // Update Function Calls
    updateChickens(timeDiff)
    updateMoney(timeDiff)
    updateContractPool(timeDiff)
    // Non time sensitive
    unlockAchievements()
    updateStats()
    progressionUpdates()

    gameState.data.time = now
}

function updateMoney(diff) {
    const baseValue = eggs[gameState.data.indexValues.currentEgg].baseValue
    const eggValueBonus = calculateEggValueBonus()
    const eggValue = baseValue.times(eggValueBonus)
    const layRate = calculateLayRate()
    const eggsProduced = (gameState.data.currency.chickens.times(layRate)).times(diff)
    
    gameState.data.currency.money = gameState.data.currency.money.plus(eggsProduced.times(eggValue))
    //console.log(diff)
}

function updateChickens(diff) {
    const chickenGain = calculateInternalHatchery()
    gameState.data.currency.chickens = gameState.data.currency.chickens.plus((chickenGain.times(diff)))
}

function updateStats() {
    if(gameState.data.currency.soulEggs.gt(gameState.data.stats.bestSoulEggs))
        gameState.data.stats.bestSoulEggs = gameState.data.currency.soulEggs
    if(gameState.data.currency.money.gt(gameState.data.stats.bestMoney))
        gameState.data.stats.bestMoney = gameState.data.currency.money
    if(gameState.data.currency.chickens.gt(gameState.data.stats.bestChickens))
        gameState.data.stats.bestChickens = gameState.data.currency.chickens
}

function progressionUpdates() {
    if(!gameState.data.progression.unlockedContracts && gameState.data.progression.hasPrestiged) {
        //Need to have Prestiged to Unlock
        gameState.data.progression.unlockedContracts = true        
    }
    
    if(!gameState.data.progression.unlockedEggspeditions && gameState.data.progression.hasPrestiged && gameState.data.indexValues.currentEgg >= 5) {
        // Need to have Prestiged + Reach Fusion Eggs for Eggspeditions to Appear
        gameState.data.progression.unlockedEggspeditions = true
    }
}
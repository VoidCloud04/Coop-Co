import { unlockAchievements } from "./AchievementsManager"
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
    
    // Update Function Calls
    updateChickens(timeDiff)
    updateMoney(timeDiff)

    unlockAchievements()
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
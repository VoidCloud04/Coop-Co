import { unlockAchievements } from "./AchievementsManager"
import { gameState } from "./DataManager.svelte"

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

    // Update Function Calls

    unlockAchievements()
    gameState.data.time = now
}


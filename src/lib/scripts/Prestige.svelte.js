import Decimal from "break_eternity.js";
import { gameState } from "./DataManager.svelte";

export function calculateSoulEggGain() {
    let soulEggGain = Decimal.floor(Decimal.sqrt(Decimal.sqrt(gameState.data.currency.money)))

    return soulEggGain
}

function prestige() {
    if(gameState.data.indexValues.currentEgg < 3) return // Unlock Rocket Fuel or Higher can Prestige
    if(gameState.data.indexValues.currentContract !== -1 || 
        gameState.data.indexValues.currentPlanet !== -1) return // If on a planet or on a contract don't prestige

}
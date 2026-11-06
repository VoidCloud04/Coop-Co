import Decimal from "break_eternity.js";
import { gameState } from "./DataManager.svelte";
import { confirmModal } from "./ModalManager.svelte";
import { commonResearch } from "./ResearchManager";

export function calculateSoulEggGain() {
    let soulEggGain = Decimal.floor(Decimal.sqrt(Decimal.sqrt(gameState.data.currency.money)))

    return soulEggGain
}

export function calculateSoulEggBoost() {
    const soulAvg = (gameState.data.currency.soulEggs.plus(gameState.data.stats.bestSoulEggs)).dividedBy(2)
    let boost = Decimal.dOne.plus(soulAvg.times(new Decimal(0.01).plus(new Decimal(0.01).times(gameState.data.research.epicResearch[2]))))
    boost = boost.times(calculateProphecyEggSoulBonus())
    return boost
}

export function calculateEffectiveProphecyEggs() {
    if(gameState.data.currency.prophecyEggs.gte(10000)) {
        return new Decimal(10000).times(Decimal.dOne.add(Decimal.log10(gameState.data.currency.prophecyEggs.dividedBy(10000))))
    }
    else 
        return gameState.data.currency.prophecyEggs
}


export function calculateProphecyEggSoulBonus() {
    return Decimal.pow(new Decimal(1.01), calculateEffectiveProphecyEggs())
}


export function calculateProphecyEggRewardBonus() {
    return Decimal.dOne.add(Decimal.sqrt(calculateEffectiveProphecyEggs().times(new Decimal(0.35))))
}


export function calculateProphecyGoalDebuff(goalIndex = 0) {
    const goalCoefficients = [new Decimal(0.5), new Decimal(0.5), new Decimal(0.15)]
    const coefficient = goalCoefficients[goalIndex] ?? goalCoefficients[0]
    return Decimal.dOne.add(Decimal.sqrt(calculateEffectiveProphecyEggs().times(coefficient)))
}

export async function prestige() {
    if(gameState.data.indexValues.currentEgg < 3) return // Unlock Rocket Fuel or Higher can Prestige
    if(gameState.data.indexValues.currentContract !== -1 || 
        gameState.data.indexValues.currentPlanet !== -1) return // If on a planet or on a contract don't prestige
    
    const confirmed = gameState.data.settings.toggles[4] ? await confirmModal({
        title: 'Are you sure you want to Prestige?',
        content: 'This will reset your current egg and common research for Soul Eggs, it is recommend to get at least 1,000 on first prestige',
        color: 'purple'
    }) : true
    
    if(confirmed) {
        const soulEggGain = calculateSoulEggGain()
        if(!gameState.data.progression.hasPrestiged) gameState.data.progression.hasPrestiged = true
        gameState.data.stats.last3Prestiges.push(soulEggGain)
        if(gameState.data.stats.last3Prestiges.length > 3) gameState.data.stats.last3Prestiges.shift()
        gameState.data.currency.soulEggs = gameState.data.currency.soulEggs.plus(soulEggGain)

        // Reset Values
        gameState.data.research.commonResearch = new Array(commonResearch.length).fill(0)
        gameState.data.currency.chickens = Decimal.dZero
        gameState.data.currency.money = Decimal.dZero
        gameState.data.indexValues.currentEgg = 0
    }
}
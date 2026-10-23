import Decimal from "break_eternity.js"
import { commonResearch, epicResearch, legendaryResearch } from "./ResearchManager"
import { eggs } from "./EggManager"
import { achievements } from "./AchievementsManager"
import { planets } from "./EggspeditionsManager"

function DefaultDataObject() {
    return {
        currency: {
            money: Decimal.dZero,
            chickens: Decimal.dZero,
            soulEggs: Decimal.dZero,
            prophecyEggs: Decimal.dZero,
            knowleggs: Decimal.dZero
        },
        research: {
            commonResearch: new Array(commonResearch.length),
            epicResearch: new Array(epicResearch.length),
            legendaryResearch: new Array(legendaryResearch.length)
        },
        progression: {
            achievements: new Array(achievements.length),
            hasPrestiged: false,
            hasAscended: false,
            unlockedContracts: false,
            unlockedEggspeditions: false,
            unlockedEgg: new Array(eggs.length),
            planets: new Array(planets.length), // Not Decided new Structure Yet Likely change from this to fit a different style for each planet
            unlockedPlanet: new Array(planets.length).fill(false),
        },
        contracts: {
            contractsPool: new Array(),
            activeContract: -1,

        },
        ascension: {
            harvesters: new Array(), // {level: 0, timeRemaining: 0}
            artifacts: new Array(), // {unlocked: bool, count: Decimal}
            gems: new Array(), // {unlocked: bool, count: Decimal}
            loadouts: new Array(), // {index: -1, gems: Array(3).fill(-1)}
            activeLoadout: new Array() // {index -1, gems: Array(3).fill(-1)}
        },
        automation: {
            commonAutomatorActive: new Array(3).fill(false),
            epicAutomatorActive: new Array(1).fill(false),
            legendaryAutomatorActive: new Array(1).fill(false)
        },
        indexValues: {
            currentEgg: 0,
            currentPlanet: -1,
            currentContract: -1,
            currentTab: 0,
            currentSubTab: new Array(3).fill(0),
        },
        stats: {
            bestMoney: Decimal.dZero,
            bestSoulEggs: Decimal.dZero,
            bestKnowleggs: Decimal.dZero,
            contractsComplete: Decimal.dZero,
            timePlayed: Decimal.dZero,
            last3Prestiges: new Array(3).fill(Decimal.dZero),
            last3Ascensions: new Array(3).fill(Decimal.dZero)
        },
        settings: {
            buyAmounts: new Array(3).fill(0),
            toggles: new Array(7).fill(false)

        },
        saveVersion: 'v3.0.0'
    }
}

const gameKey = 'coopCo-Revised'
export let gameState = $state({
    data: DefaultDataObject(),
    runTimeData: {}
})
export const buyAmountLabels = ['1','5','10','20','Max']

export function Load() {
    console.log('Loaded Data')
    let loadedData = window.localStorage.getItem(gameKey)
    if(loadedData === null || loadedData === undefined)
        gameState.data = DefaultDataObject()
    else
        gameState.data = JSON.parse(loadedData)
}

export function Save() {
    console.log('Saved Data')
}

// Helpers

export function updateBA(index) {
    gameState.data.settings.buyAmounts[index] += 1
    if(gameState.data.settings.buyAmounts[index] > buyAmountLabels.length - 1)
        gameState.data.settings.buyAmounts[index] = 0
    // console.log(gameState.data.settings.buyAmounts[index])
}

export function toggleAutomator(classIndex, index) {
    switch(classIndex) {
        case 0:
            gameState.data.automation.commonAutomatorActive[index] = !gameState.data.automation.commonAutomatorActive[index]
            break
        case 1:
            gameState.data.automation.epicAutomatorActive[index] = !gameState.data.automation.epicAutomatorActive[index]
            break
        case 2:
            gameState.data.automation.legendaryAutomatorActive[index] = !gameState.data.automation.legendaryAutomatorActive[index]
            break
        default:
            console.warn("Invalid index supplied to toggleAutomator classIndex")
            break
    }
}
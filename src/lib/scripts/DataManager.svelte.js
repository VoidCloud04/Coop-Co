import Decimal from "break_eternity.js"
import { commonResearch, epicResearch, legendaryResearch } from "./ResearchManager"

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
            achievements: new Array(),
            hasPrestiged: false,
            hasAscended: false,
            unlockedContracts: false,
            unlockedEggspeditions: false,
            unlockedEgg: new Array(),
            planets: new Array(), // Not Decided new Structure Yet Likely change from this to fit a different style for each planet
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
        },
        settings: {
            buyAmounts: new Array(3).fill(0),
            toggles: new Array(7).fill(false)

        },
        saveVersion: 'v3.0.0'
    }
}

const gameKey = 'coopCo-Revised'
export let data = $state(DefaultDataObject())
export let runTimeData = $state({})
export const buyAmountLabels = ['1','5','10','20','Max']

export function Load() {

}

export function Save() {

}

// Helpers

export function updateBA(index) {
    data.settings.buyAmounts[index] += 1
    if(data.settings.buyAmounts[index] > buyAmountLabels.length - 1)
        data.settings.buyAmounts[index] = 0
    // console.log(data.settings.buyAmounts[index])
}

export function toggleAutomator(classIndex, index) {
    switch(classIndex) {
        case 0:
            data.automation.commonAutomatorActive[index] = !data.automation.commonAutomatorActive[index]
            break
        case 1:
            data.automation.epicAutomatorActive[index] = !data.automation.epicAutomatorActive[index]
            break
        case 2:
            data.automation.legendaryAutomatorActive[index] = !data.automation.legendaryAutomatorActive[index]
            break
        default:
            console.warn("Invalid index supplied to toggleAutomator classIndex")
            break
    }
}
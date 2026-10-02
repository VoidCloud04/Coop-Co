import Decimal from "break_eternity.js"

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
            commonResearch: new Array(),
            epicResearch: new Array(),
            legendaryResearch: new Array()
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

export function Load() {

}

export function Save() {

}
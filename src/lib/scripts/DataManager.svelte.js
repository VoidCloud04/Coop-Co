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
            commonResearch: new Array(commonResearch.length).fill(0),
            epicResearch: new Array(epicResearch.length).fill(0),
            legendaryResearch: new Array(legendaryResearch.length).fill(0)
        },
        progression: {
            achievements: new Array(achievements.length),
            hasPrestiged: false,
            hasAscended: false,
            unlockedContracts: false,
            unlockedEggspeditions: false,
            unlockedEgg: new Array(eggs.length).fill(false),
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
        saveVersion: 'v3.0.0',
        time: Date.now()
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
        loadedData = DefaultDataObject()
    else {
        try {
            loadedData = fixSave(DefaultDataObject(),loadedData)
        }
        catch(error) {
            console.error("Could not Load Save Reverting to Defaults ",error)
            loadedData = DefaultDataObject()
        }
    }
    // console.log(loadedData)
    gameState.data = loadedData
    // Pre Start Checks
    if(!gameState.data.progression.unlockedEgg[0]) {
        gameState.data.progression.unlockedEgg[0] = true
    }
    Save()
}

export function Save() {
    window.localStorage.setItem(gameKey,JSON.stringify(gameState.data))
    console.log('Saved Data')
}

// Helpers

function fixSave(defaults, saved, path = "data") {
    if (defaults instanceof Decimal) {
        if (saved === undefined || saved === null) return defaults

        try {
            const value = new Decimal(saved);
            if (value.isNaN()) throw new Error("Invalid Decimal")
            return value
        } catch {
            console.warn(`Invalid Decimal at ${path}; using default`)
            return defaults
        }
    }

    if (Array.isArray(defaults)) {
        if (defaults.length === 0) {
            return Array.isArray(saved) ? saved : []
        }

        const savedArray = Array.isArray(saved) ? saved : []
        return defaults.map((defaultItem, index) =>
            fixSave(defaultItem, savedArray[index], `${path}[${index}]`)
        )
    }

    if (defaults !== null && typeof defaults === "object") {
        const savedObject =
            saved !== null && typeof saved === "object" && !Array.isArray(saved) ? saved : {}

        const result = {}

        // Start from the defaults, so missing fields are restored.
        for (const key of Object.keys(defaults)) {
            result[key] = fixSave(defaults[key],savedObject[key],`${path}.${key}`)
        }

        // Optionally preserve fields from the save that aren't in the defaults.
        for (const key of Object.keys(savedObject)) {
            if (!(key in defaults)) result[key] = savedObject[key]
        }

        return result
    }

    return saved === undefined ? defaults : saved;
}

export function Import() {

}

export function Export() {
    console.log("Exported to Clipboard Successfully")
    navigator.clipboard.writeText(btoa(JSON.stringify(gameState.data)))
}

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
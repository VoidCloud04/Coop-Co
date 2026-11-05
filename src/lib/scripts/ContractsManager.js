import Decimal from "break_eternity.js"
import { getRandom } from "./Utilities"
import { eggs } from "./EggManager"
import { gameState } from "./DataManager.svelte"

export const gradeNames = ["D","C","B","A","AA","AAA"] // AAA locked behind Ascension
const gradePointBudgets = [1,3,5,10,15,20] // How many points can be spent on a contract per grade
export const gradeWalls = [new Decimal(1000),new Decimal(2500),new Decimal(5000),new Decimal(7500), new Decimal(10000)]
const baseRepGain = [10,50,100,1000,2500]
const expiryTimeInMinutes = 180 // 3 Hours from creation to expiration
export const contractGoals = ["Delivery","Value","Farm Density"] // Tracks Eggs Produced, Total Money, Total Chickens
export const contractGoalCurrencies = ["Eggs", "Money", "Chickens"]
export const baseGoalPerGrade = [ // Traversed by [gradeIndex][contractGoalIndex]
    [Decimal.dZero, Decimal.dZero, Decimal.dZero],
    [Decimal.dZero, Decimal.dZero, Decimal.dZero],
    [Decimal.dZero, Decimal.dZero, Decimal.dZero],
    [Decimal.dZero, Decimal.dZero, Decimal.dZero],
    [Decimal.dZero, Decimal.dZero, Decimal.dZero],
    [Decimal.dZero, Decimal.dZero, Decimal.dZero]
]
export const baseProphecyStakePerGrade = [Decimal.dZero,new Decimal(5), new Decimal(10), new Decimal(50), new Decimal(100), new Decimal(250)] // D contracts will always cost nothing to start, but provide very little reward

export const modifiers = [ // All available debuffs to be rolled by a contract
    {
        name: "Egg Value", // Debuff Chip Name/Effect
        type: "mul", // Type of Effect (mul,sub,exp)
        debuffs: [0.1,0.25,0.35,0.5] // Debuff Scalar Array costs the generation function 1-4 points, limit of points for debuffs depends on contract grade
    },
    {
        name: "Chicken Gain",
        type: "mul",
        debuffs: [0.2,0.3,0.4,0.5]
    },
    {
        name: "Research Cost",
        type: "exp",
        debuffs: [0.15,0.3,0.45,0.6]
    },
    {
        name: "Lay Rate",
        type: "mul",
        debuffs: [0.05,0.1,0.15,0.25]
    }
]

export const contracts = [ // All available contracts on specific eggs
    {
        name: 'Supermarket Shortage',
        desc: 'A mad rush for Regular eggs has left store shelves empty, rectify this as quickly as possible',
        eggIndex: 0
    },
    {
        name: 'Energy Crisis',
        desc: 'A Californian Energy Shortage means more demand for Fusion Eggs.',
        eggIndex: 5
    },
    {
        name: 'GPT-10.0',
        desc: 'To make the ultimate version of ChatGPT, AI Eggs are needed',
        eggIndex: 15
    },
    {
        name: 'Pandemic',
        desc: 'A Pandemic is covering the world, Medical Eggs are needed to save lives.',
        eggIndex: 2
    },
    {
        name: 'Supreme Diets',
        desc: 'Dieting is back in fashion people need more Superfood Eggs.',
        eggIndex: 1
    },
    {
        name: 'Fountain of Youth',
        desc: 'People are wanting to stay youthful, Immortality Eggs are needed to keep them that way.',
        eggIndex: 7
    },
    {
        name: 'Supply Chain Crisis',
        desc: 'Supply Chain Issues have caused resource shortages, Supermaterial Eggs are needed to offset the shortage.',
        eggIndex: 4
    },
    {
        name: 'Temporal Tear',
        desc: 'A Temporal Tear has caused a rift in the space-time continuum, Tachyon Eggs are needed to fix it.',
        eggIndex: 8
    },
    {
        name: 'Space-Eggx',
        desc: 'Egglon Musk needs massive amounts of rocketfuel eggs for his new Chicken-9 Rocket',
        eggIndex: 3
    },
    {
        name: 'Terraforming Venus',
        desc: 'In order to terraform all of Venus we need mass production of Terraform Eggs',
        eggIndex: 12
    },
]

/**
 * Contract Object Structure:
 * {
 *  grade: Integer 0-gradeNames.length-1
 *  contractIndex: Integer 0-contracts.length-1
 *  modifiers: Array(Array(2)) -> [modifierIndex,debuffIndex],
 *  goal: Array(2) -> [goalIndex,goalValue], // Goal Calculation done by baseValueAtGrade * baseEggValue * Prophecy Egg Debuff
 *  prophecy: Array(2) -> [stakeValue,rewardValue] // reward will be Round((stake+1) * 1.5 * Prophecy Egg Gain Reward)
 *  repGain: baseRep[gradeIndex] * (Grade Penalty/Bonus - 0.25 per level below or 0.25 per level above) * Prophecy Egg Bonus
 *  expiration: simple seconds based counter that is decremented to 0, will be paused when the contract is active
 * }
 */

// Extra Rules I keep in mind:
// Contract[0] will be 1 grade lower than current if not at Grade D
// Contract[3] will be 1 grade higher than current if not at Grade AAA

export function generateContract(desiredGrade) {
    const contractObject = {
        grade: desiredGrade,
        contractIndex: null,
        modifiers: new Array(),
        prophecy: new Array(2).fill(null),
        goal: new Array(2).fill(null), 
        repGain: null,
        expiration: null
    }
    const pointCeiling = gradePointBudgets[desiredGrade]
    let pointsUsed = 0
    
    // Select Contract from Pool randomly
    contractObject.contractIndex = getRandom(0,contracts.length - 1)
    // Select Goal Type and Calculate Value
    contractObject.goal[0] = getRandom(0,contractGoals.length - 1)
    contractObject.goal[1] = baseGoalPerGrade[desiredGrade][contractObject.goal[0]].times(eggs[contracts[contractObject.contractIndex].eggIndex].baseValue).times(Decimal.dOne) // Replace Decimal Constant with Calculated Prophecy Egg Debuff
    // Generate Prophecy Egg Stake + Reward
    contractObject.prophecy[0] = baseProphecyStakePerGrade[desiredGrade]
    contractObject.prophecy[1] = Decimal.round(Decimal.max(baseProphecyStakePerGrade[desiredGrade],Decimal.dOne).times(new Decimal(1.5)).times(Decimal.dOne)) // Replace Decimal Constant with Calculated Prophecy Egg Buff
    // Generate repGain = baseRepGain * gradeIncreaseModifier (*0.25 less or greater depending on if contract is lower or higher than current grade and depending on how many levels lower)
    const gradeDiff = gameState.data.contracts.gradeIndex - desiredGrade
    let repMul = Decimal.dOne
    if(gradeDiff < 0) { // desiredGrade is higher
        repMul = new Decimal(0.2).times(gradeDiff)
    }
    else if(gradeDiff > 0) { // desiredGrade is lower
        repMul = new Decimal(0.2).times(gradeDiff).times(-1)
    }
    contractObject.repGain = baseRepGain[desiredGrade].times(repMul)
    // "Purchase" modifiers from the pool using points
    // Each loop will pick a modifier at random if it already isn't in the pool
    // Then greedily pick the most value for that modifier it can afford

    while (pointsUsed < pointCeiling) {
        const usedIndices = new Set(
            contractObject.modifiers.map(([index]) => index)
        );
        const availableIndices = modifiers
            .map((_, index) => index)
            .filter(index => !usedIndices.has(index));

        if (availableIndices.length === 0) break;

        const debuffIndex =
            availableIndices[getRandom(0, availableIndices.length - 1)];

        const remaining = pointCeiling - pointsUsed;
        const levels = modifiers[debuffIndex].debuffs.length;
        const levelCount = Math.min(remaining, levels);
        const debuffLevel = levelCount - 1;
        const cost = debuffLevel + 1;

        contractObject.modifiers.push([debuffIndex, debuffLevel]);
        pointsUsed += cost;
    }

    console.log(contractObject)
    return contractObject
}

export function updateContractPool(diff) {
    // Check if any contracts have been set to null and auto generate
    // Update All contract expiration counters
    // Check if a contract expired and regenerate
}

export function runContract(diff) {
    if(gameState.data.indexValues.activeContract === -1) return
    // Update Goal Tracker
    // Check Goal Condition
    // If Complete finish the contract
    // If not keep going
}

export function startContract(index) {
    if(gameState.data.indexValues.activeContract !== -1) return
    // Reset Farm Researches, Money, Chickens
    // Stake Prophecy Eggs
    // Set Egg Index & Active Contract Index
}

export function stopContract(index) {
    if(gameState.data.indexValues.activeContract === -1) return
    // Requires confirmation before doing
    // Reset Active Contract Index
    // Remove reputation (half of the reward)
    // Reset Farm back to Regular just like prestige does (just without a reward)

    
}

function completeContract() {
    if(gameState.data.indexValues.activeContract === -1) return
    // Return Prophecy Egg Stake + Reward
    // Add Reputation
    // Check if Reputation is over next gradeIndex level (+ in the case of AAA, that you have the requisite legendaryResearch) if we are at max level just ignore this step
    // If it is, set reputation to the remainder of the current - requirement and bump up gradeIndex
    // Reset Active Contract Index
    // Reset farm back to Regular in the same 
} 
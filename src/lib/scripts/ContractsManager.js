import Decimal from "break_eternity.js"
import { format, getRandom } from "./Utilities"
import { calculateLayRate, eggs } from "./EggManager"
import { gameState } from "./DataManager.svelte"
import { confirmModal } from "./ModalManager.svelte"
import { generateNotification } from "./NotificationManager.svelte"
import { calculateProphecyEggRewardBonus, calculateProphecyGoalDebuff } from "./Prestige.svelte"

export const gradeNames = ["D","C","B","A","AA","AAA"] // AAA locked behind Ascension
const gradePointBudgets = [1,3,5,10,15,20] // How many points can be spent on a contract per grade
export const gradeWalls = [new Decimal(100),new Decimal(500),new Decimal(1000),new Decimal(5000), new Decimal(10000)]
const baseRepGain = [new Decimal(10),new Decimal(50),new Decimal(100),new Decimal(1000),new Decimal(2500)]
const expiryTimeInMinutes = 180 // 3 Hours from creation to expiration
export const contractGoals = ["Delivery","Value","Farm Density"] // Tracks Eggs Produced, Total Money, Total Chickens
export const contractGoalCurrencies = ["Eggs", "Money", "Chickens"]
export const baseGoalPerGrade = [ // Traversed by [gradeIndex][contractGoalIndex]
    [new Decimal(1e6), new Decimal(1e6), new Decimal(1e4)],
    [new Decimal(5e6), new Decimal(1e9), new Decimal(5e4)],
    [new Decimal(1e7), new Decimal(1e12), new Decimal(1e5)],
    [new Decimal(5e7), new Decimal(1e15), new Decimal(5e5)],
    [new Decimal(1e8), new Decimal(1e18), new Decimal(1e6)],
    [new Decimal(1e9), new Decimal(1e21), new Decimal(1e7)]
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
        type: "exp", // Adds the debuff value to the research cost exponent (cost^(1 + value))
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
 *  repGain: baseRep[gradeIndex] adjusted by the difference between the contract grade and the player's grade
 *  expiration: simple seconds based counter that is decremented to 0, will be paused when the contract is active
 * }
 *
 * Goal Progress:
 *  Delivery (goalIndex 0) uses contracts.eggProgress, which accumulates eggs laid while the contract is active.
 *  Value (goalIndex 1) uses the player's current money.
 *  Farm Density (goalIndex 2) uses the player's current chickens.
 *
 * A contract is active when indexValues.currentContract points at its index in contracts.contractPool.
 * Starting a contract deducts prophecy[0] from the player's Prophecy Eggs. Completing it returns
 * prophecy[0] + prophecy[1]; abandoning it forfeits the stake and costs half of repGain.
 */

// Extra Rules I keep in mind:
// Contract[0] will be a random grade below the current grade if not at Grade D
// Contract[3] will be 1 grade higher than current if not at Grade AAA
// Contract[1] and Contract[2] will be the current grade

/**
 * Returns the modifiers of the currently active contract as
 * { name, type, value } objects. Returns an empty array when no contract is active.
 */
export function getActiveDebuffs() {
    const activeContractIndex = gameState.data.indexValues.currentContract
    if(activeContractIndex === -1) return []

    const activeContract = gameState.data.contracts.contractPool[activeContractIndex]
    if(!activeContract) return []

    return activeContract.modifiers.map(([modifierIndex, debuffIndex]) => ({
        name: modifiers[modifierIndex].name,
        type: modifiers[modifierIndex].type,
        value: modifiers[modifierIndex].debuffs[debuffIndex]
    }))
}

/**
 * Applies every active debuff with the given name to a value.
 * "mul" multiplies the value, "sub" subtracts from it, and "exp" adds the
 * debuff value to its exponent (e.g. cost^(1 + 0.15)).
 */
export function applyContractDebuffs(baseValue, targetName) {
    let value = new Decimal(baseValue)

    for(const debuff of getActiveDebuffs()) {
        if(debuff.name !== targetName) continue

        switch(debuff.type) {
            case "mul":
                value = value.times(debuff.value)
                break
            case "sub":
                value = Decimal.max(Decimal.dZero, value.minus(debuff.value))
                break
            case "exp":
                value = value.pow(Decimal.dOne.plus(debuff.value))
                break
        }
    }

    return value
}

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
    contractObject.expiration = expiryTimeInMinutes * 60
    const pointCeiling = gradePointBudgets[desiredGrade]
    let pointsUsed = 0
    
    // Only consider contracts whose egg the player has already unlocked
    const unlockedContractIndices = contracts
        .map((_, index) => index)
        .filter(index => gameState.data.progression.unlockedEgg[contracts[index].eggIndex])

    if (unlockedContractIndices.length === 0) return null

    // Select Contract from Pool randomly
    contractObject.contractIndex = unlockedContractIndices[getRandom(0, unlockedContractIndices.length - 1)]
    // Select Goal Type and Calculate Value
    contractObject.goal[0] = getRandom(0,contractGoals.length - 1)
    if(contractObject.goal[0] === 1)
        contractObject.goal[1] = baseGoalPerGrade[desiredGrade][contractObject.goal[0]].times(eggs[contracts[contractObject.contractIndex].eggIndex].baseValue).times(calculateProphecyGoalDebuff(contractObject.goal[0]))
    else
        contractObject.goal[1] = baseGoalPerGrade[desiredGrade][contractObject.goal[0]].times(calculateProphecyGoalDebuff(contractObject.goal[0]))
    // Prophecy Reward Calculations
    contractObject.prophecy[0] = baseProphecyStakePerGrade[desiredGrade]
    contractObject.prophecy[1] = Decimal.round(Decimal.max(baseProphecyStakePerGrade[desiredGrade],Decimal.dOne).times(new Decimal(1.5)).times(calculateProphecyEggRewardBonus()))
    // Generate repGain = baseRepGain * gradeIncreaseModifier (*0.25 less or greater depending on if contract is lower or higher than current grade and depending on how many levels lower)
    const gradeDiff = gameState.data.contracts.gradeIndex - desiredGrade
    let repMul = Decimal.dOne
    if(gradeDiff > 0) { // desiredGrade is higher
        repMul = new Decimal(0.2).times(gradeDiff)
    }
    else if(gradeDiff < 0) { // desiredGrade is lower
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

    return contractObject
}

export function updateContractPool(diff) {
    if(!gameState.data.progression.unlockedContracts) return
    // Check if any contracts have been set to null and auto generate
    // Update All contract expiration counters
    // Check if a contract expired and regenerate
    for(let i = 0; i < gameState.data.contracts.contractPool.length; i++) {
        if(gameState.data.contracts.contractPool[i] === null) {
            if(i === 0 && gameState.data.contracts.gradeIndex > 0) {
                const desiredGrade = getRandom(0,gameState.data.contracts.gradeIndex-1)
                gameState.data.contracts.contractPool[i] = generateContract(desiredGrade)
            }
            else if(i === 3 && gameState.data.contracts.gradeIndex < gradeNames.length - 1) {
                const desiredGrade = gameState.data.contracts.gradeIndex+1
                gameState.data.contracts.contractPool[i] = generateContract(desiredGrade)
            }
            else {
                gameState.data.contracts.contractPool[i] = generateContract(gameState.data.contracts.gradeIndex)
            }
        }
        else if(gameState.data.contracts.contractPool[i].expiration < 0) {
            generateNotification("A contract expired!","error")
            gameState.data.contracts.contractPool[i] = null
        }
        else if(i != gameState.data.indexValues.currentContract) {
            gameState.data.contracts.contractPool[i].expiration -= diff
        }
    }
    
}

export function runContract(diff) {
    const activeContractIndex = gameState.data.indexValues.currentContract
    if(activeContractIndex === -1) return

    const contract = gameState.data.contracts.contractPool[activeContractIndex]
    if(!contract) return

    // Delivery measures the total eggs laid during the contract, so keep a running counter.
    if(contract.goal[0] === 0) {
        const eggsProduced = gameState.data.currency.chickens.times(calculateLayRate()).times(diff)
        const currentProgress = gameState.data.contracts.eggProgress ?? Decimal.dZero
        gameState.data.contracts.eggProgress = currentProgress.plus(eggsProduced)
    }

    let goalReached = false
    switch(contract.goal[0]) {
        case 0:
            goalReached = (gameState.data.contracts.eggProgress ?? Decimal.dZero).gte(contract.goal[1])
            break
        case 1:
            goalReached = gameState.data.currency.money.gte(contract.goal[1])
            break
        case 2:
            goalReached = gameState.data.currency.chickens.gte(contract.goal[1])
            break
    }

    if(goalReached) completeContract()
}

export function startContract(index) {
    if(gameState.data.indexValues.currentContract !== -1) return

    const contract = gameState.data.contracts.contractPool[index]
    if(!contract) return
    if(contract.grade > gameState.data.contracts.gradeIndex) return

    const stake = contract.prophecy[0]
    if(gameState.data.currency.prophecyEggs.lt(stake)) return

    // Reset Farm Researches, Money, Chickens
    gameState.data.currency.prophecyEggs = gameState.data.currency.prophecyEggs.minus(stake)
    resetFarm()
    resetContractProgress()

    // Set Egg Index & Active Contract Index
    gameState.data.indexValues.currentEgg = contracts[contract.contractIndex].eggIndex
    gameState.data.indexValues.currentContract = index

    if(gameState.data.settings.toggles[2])
        generateNotification(`Contract ${contracts[contract.contractIndex].name} Started!`, 'warn')
}

export async function stopContract(index = gameState.data.indexValues.currentContract) {
    const activeContractIndex = gameState.data.indexValues.currentContract
    if(activeContractIndex === -1) return
    if(index !== activeContractIndex) return

    const contract = gameState.data.contracts.contractPool[activeContractIndex]
    if(!contract) {
        gameState.data.indexValues.currentContract = -1
        resetFarm()
        resetContractProgress()
        return
    }

    const confirmed = await confirmModal({
        title: 'Abandon this contract?',
        content: `You will lose your ${format(contract.prophecy[0])} Prophecy Egg stake and ${format(contract.repGain.div(2))} Reputation.`,
        color: 'red'
    })

    if(!confirmed) return
    if(gameState.data.indexValues.currentContract !== activeContractIndex) return

    // The stake is forfeited and half of the reputation reward is lost.
    gameState.data.contracts.totalReputation = Decimal.max(
        Decimal.dZero,
        gameState.data.contracts.totalReputation.minus(contract.repGain.div(2))
    )
    gameState.data.indexValues.currentContract = -1
    resetFarm()
    resetContractProgress()

    if(gameState.data.settings.toggles[2])
        generateNotification(`Contract ${contracts[contract.contractIndex].name} Abandoned!`, 'error')
}

function completeContract() {
    const activeContractIndex = gameState.data.indexValues.currentContract
    if(activeContractIndex === -1) return

    const contract = gameState.data.contracts.contractPool[activeContractIndex]
    if(!contract) {
        gameState.data.indexValues.currentContract = -1
        return
    }

    // Return Prophecy Egg Stake + Reward and add the reputation reward.
    gameState.data.currency.prophecyEggs = gameState.data.currency.prophecyEggs
        .plus(contract.prophecy[0])
        .plus(contract.prophecy[1])
    gameState.data.contracts.totalReputation = gameState.data.contracts.totalReputation.plus(contract.repGain)
    gameState.data.stats.contractsComplete = gameState.data.stats.contractsComplete.plus(Decimal.dOne)

    // Check if reputation is over the next grade wall. AAA also requires the
    // legendary research, and at max grade there is nothing left to promote into.
    promoteGrade()

    // Reset Active Contract Index and let the pool generate a replacement.
    gameState.data.indexValues.currentContract = -1
    gameState.data.contracts.contractPool[activeContractIndex] = null
    resetFarm()
    resetContractProgress()

    if(gameState.data.settings.toggles[2])
        generateNotification(`Contract ${contracts[contract.contractIndex].name} Completed!\n+${format(contract.prophecy[1])} Prophecy Eggs`, 'success')
}

function resetFarm() {
    gameState.data.research.commonResearch = new Array(gameState.data.research.commonResearch.length).fill(0)
    gameState.data.currency.money = Decimal.dZero
    gameState.data.currency.chickens = Decimal.dZero
    gameState.data.indexValues.currentEgg = 0
}

function resetContractProgress() {
    gameState.data.contracts.eggProgress = Decimal.dZero
}

function promoteGrade() {
    const contractsData = gameState.data.contracts

    while(contractsData.gradeIndex < gradeNames.length - 1) {
        const wall = gradeWalls[contractsData.gradeIndex]
        if(!wall || contractsData.totalReputation.lt(wall)) break

        const nextGrade = contractsData.gradeIndex + 1
        // Grade AAA additionally requires the relevant legendary research.
        if(nextGrade === gradeNames.length - 1 && gameState.data.research.legendaryResearch[1] < 1) break

        contractsData.totalReputation = contractsData.totalReputation.minus(wall)
        contractsData.gradeIndex = nextGrade
    }
}

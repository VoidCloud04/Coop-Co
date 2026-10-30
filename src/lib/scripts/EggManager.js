import Decimal from "break_eternity.js";
import { gameState } from "./DataManager.svelte";
import { commonResearch } from "./ResearchManager";

export const eggs = [
    {
        name: "Regular",
        discoveryReq: new Decimal(0),
        unlockReq: new Decimal(0),
        baseValue: new Decimal(0.25)
    },
    {
        name: "Superfood",
        discoveryReq: new Decimal(1e7),
        unlockReq: new Decimal(6.8e7),
        baseValue: new Decimal(1.25)
    },
    {
        name: "Medical",
        discoveryReq: new Decimal(8.4e8),
        unlockReq: new Decimal(5.3e9),
        baseValue: new Decimal(6.25)
    },
    {
        name: "Rocket Fuel",
        discoveryReq: new Decimal(3.8e10),
        unlockReq: new Decimal(2.4e11),
        baseValue: new Decimal(30)
    },
    {
        name: "Super Material",
        discoveryReq: new Decimal(2.7e13),
        unlockReq: new Decimal(1.7e14),
        baseValue: new Decimal(150)
    },
    {
        name: "Fusion",
        discoveryReq: new Decimal(8e15),
        unlockReq: new Decimal(5e16),
        baseValue: new Decimal(700)
    },
    {
        name: "Quantum",
        discoveryReq: new Decimal(3.6e18),
        unlockReq: new Decimal(2.3e19),
        baseValue: new Decimal(3e3)
    },
    {
        name: "Immortality",
        discoveryReq: new Decimal(1.5e22),
        unlockReq: new Decimal(9.4e22),
        baseValue: new Decimal(1.25e4)
    },
    {
        name: "Tachyon",
        discoveryReq: new Decimal(2.7e25),
        unlockReq: new Decimal(1.7e26),
        baseValue: new Decimal(5e4)
    },
    {
        name: "Graviton",
        discoveryReq: new Decimal(1.5e29),
        unlockReq: new Decimal(9.8e29),
        baseValue: new Decimal(1.75e5)
    },
    {
        name: "Dilithium",
        discoveryReq: new Decimal(7.6e32),
        unlockReq: new Decimal(4.8e33),
        baseValue: new Decimal(5.25e5)
    },
    {
        name: "Prodigy",
        discoveryReq: new Decimal(2.5e36),
        unlockReq: new Decimal(1.6e37),
        baseValue: new Decimal(1.5e6)
    },
    {
        name: "Terraform",
        discoveryReq: new Decimal(3.2e39),
        unlockReq: new Decimal(2e40),
        baseValue: new Decimal(1e7)
    },
    {
        name: "Antimatter",
        discoveryReq: new Decimal(2e43),
        unlockReq: new Decimal(1.3e44),
        baseValue: new Decimal(1e9)
    },
    {
        name: "Dark Matter",
        discoveryReq: new Decimal(1.9e47),
        unlockReq: new Decimal(1.2e48),
        baseValue: new Decimal(1e11)
    },
    {
        name: "AI",
        discoveryReq: new Decimal(5.1e51),
        unlockReq: new Decimal(3.2e52),
        baseValue: new Decimal(1e12)
    },
    {
        name: "Nebula",
        discoveryReq: new Decimal(3.2e55),
        unlockReq: new Decimal(2e56),
        baseValue: new Decimal(1.5e13)
    },
    {
        name: "Universe",
        discoveryReq: new Decimal(6.4e59),
        unlockReq: new Decimal(4e60),
        baseValue: new Decimal(1e14)
    },
    {
        name: "Enlightenment",
        discoveryReq: new Decimal(5.7e64),
        unlockReq: new Decimal(3.6e65),
        baseValue: new Decimal(0.0000001)
    }
]

export const regularEggImgIds = [
    "egg",
    "superfood",
    "medical",
    "rocketfuel",
    "supermaterial",
    "fusion",
    "quantum",
    "immortality",
    "tachyon",
    "graviton",
    "dilithium",
    "prodigy",
    "terraform",
    "antimatter",
    "darkmatter",
    "ai",
    "nebula",
    "universe",
    "enlightenment"
]

export function promoteEgg() {
    if(gameState.data.indexValues.currentEgg >= eggs.length - 1) return
    if(gameState.data.currency.money.lt(eggs[gameState.data.indexValues.currentEgg+1].unlockReq)) return

    // Reset Money, Chickens, Research, Increase currentEgg by 1 and unlock new egg if not already
    gameState.data.research.commonResearch = new Array(commonResearch.length).fill(0)
    gameState.data.currency.chickens = Decimal.dZero
    gameState.data.currency.money = Decimal.dZero
    gameState.data.indexValues.currentEgg += 1
    if(!gameState.data.progression.unlockedEgg[gameState.data.indexValues.currentEgg]) {
        gameState.data.progression.unlockedEgg[gameState.data.indexValues.currentEgg] = true
    }
}

export function calculateEggValueBonus() {
    let bonus = Decimal.dOne // starting value
    const commonResearch = gameState.data.research.commonResearch
    const epicResearch = gameState.data.research.epicResearch
    // Common Research Modifiers
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.25).times(commonResearch[1])))) // Nutritional Supplements
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.25).times(commonResearch[3])))) // Padded Packaging
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(2).times(commonResearch[4]))) // Bigger Eggs
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(3).times(commonResearch[6]))) // USDE Prime Certification
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.25).times(commonResearch[8])))) // Superfeed Diet
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.15).times(commonResearch[10])))) // Improved Genetics
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.15).times(commonResearch[11])))) // Shell Fortification
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(2).times(commonResearch[12]))) // Even Bigger Eggs
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.10).times(commonResearch[14])))) // Genetic Purification
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(2).times(commonResearch[17]))) // Graviton Coating
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.25).times(commonResearch[18])))) // Crystalline Shelling
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.25).times(commonResearch[20])))) // Telepathic Will
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.10).times(commonResearch[21])))) // Atomic Purification
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(10).times(commonResearch[22]))) // Multiversal Layering
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.05).times(commonResearch[24])))) // Eggsistor Miniaturization
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.01).times(commonResearch[25])))) // Matter Reconfiguration
    bonus = bonus.times(Decimal.max(Decimal.dOne, new Decimal(10).times(commonResearch[26]))) // Timeline Splicing
    
    // Epic Research Modifiers
    bonus = bonus.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.05).times(epicResearch[5])))) // Accounting Tricks

    return bonus
}

export function calculateInternalHatchery() {
    let chickenGain = Decimal.dZero
    const commonResearch = gameState.data.research.commonResearch
    const epicResearch = gameState.data.research.epicResearch
    // Common Research Chicken Production
    chickenGain = chickenGain.plus(new Decimal(8).times(commonResearch[2])) // Internal Hatcheries
    chickenGain = chickenGain.plus(new Decimal(20).times(commonResearch[5])) // Internal Hatchery Upgrades
    chickenGain = chickenGain.plus(new Decimal(40).times(commonResearch[9])) // Internal Hatchery Expansion
    chickenGain = chickenGain.plus(new Decimal(100).times(commonResearch[13])) // Internal Hatchery Expansion
    chickenGain = chickenGain.plus(new Decimal(20).times(commonResearch[15])) // Machine Learning Incubators
    chickenGain = chickenGain.plus(new Decimal(200).times(commonResearch[19])) // Neural Linking

    // Epic Research Chicken Gain Multipliers
    chickenGain = chickenGain.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.05).times(epicResearch[0])))) // Epic Internal Hatcheries

    // TODO: Planet, Artifact and Gem Chicken Gain Boosts

    return chickenGain.div(60) // Convert Chickens/min to Chickens/sec
}

export function calculateLayRate() {
    let layRate = Decimal.dOne
    const commonResearch = gameState.data.research.commonResearch
    const epicResearch = gameState.data.research.epicResearch
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.1).times(commonResearch[0])))) // Comfortable Nests
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.05).times(commonResearch[7])))) // Hen House A/C
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.15).times(commonResearch[10])))) // Improved Genetics
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.1).times(commonResearch[16])))) // Time Compression
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.02).times(commonResearch[23])))) // Timeline Diversion
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.1).times(commonResearch[27])))) // Relativity Optimization

    // Epic Research Lay Rate Multipliers
    layRate = layRate.times(Decimal.max(Decimal.dOne, Decimal.dOne.plus(new Decimal(0.05).times(epicResearch[4])))) // Epic Comfy Nests

    // TODO: Planet, Artifact and Gem Lay Rate Boosts

    return layRate
}
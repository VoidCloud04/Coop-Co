import Decimal from "break_eternity.js"
import { gameState } from "./DataManager.svelte"

const planetCount = 6
const artifactTiers = 4
const gemTiers = 3
const collectionWeights = [0.025, 0.05, 0.125, 0.25]
const blankObj = {name: ''}
const blankIndices = [19,38,38]

function artifactCount(index) {
    return new Decimal(gameState.data.ascension.artifacts[index]?.count ?? 0)
}

function gemCount(index) {
    return new Decimal(gameState.data.ascension.gems[index]?.count ?? 0)
}

function ownsArtifactTier(tier) {
    for(let i = 0; i < planetCount; i++)
        if(artifactCount(tier + (i * artifactTiers)).gte(1)) return true
    return false
}

function ownsGemTier(tier) {
    for(let i = 0; i < planetCount; i++)
        if(gemCount(tier + (i * gemTiers)).gt(0)) return true
    return false
}

function collectionBonus() {
    let bonus = Decimal.dOne
    for(let i = 0; i < gameState.data.ascension.artifacts.length; i++)
        bonus = bonus.add(artifactCount(i).times(collectionWeights[i % artifactTiers]))
    return bonus
}

function allHarvestersAtLevel(level) {
    if(gameState.data.ascension.harvesters.length < planetCount) return false
    for(let i = 0; i < gameState.data.ascension.harvesters.length; i++)
        if(gameState.data.ascension.harvesters[i].level < level) return false
    return true
}

function collectedMaxTierItems() {
    for(let i = 0; i < planetCount; i++) {
        if(artifactCount(3 + (i * artifactTiers)).lte(0)) return false
        if(gemCount(2 + (i * gemTiers)).lte(0)) return false
    }
    return true
}

export const achievements = [
    // Eggs
    {
        name: 'Eggcellent',
        description: 'Start Playing',
        hidden: false,
        group: 'eggs',
        img: 'Eggs/egg.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[0]}
    },
    {
        name: 'Superegg',
        description: 'Unlock the 2nd egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/superfood.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[1]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Meggdical',
        description: 'Unlock the 3rd egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/medical.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[2]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Rockegg Fuel',
        description: 'Unlock the 4th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/rocketfuel.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[3]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Uber Material',
        description: 'Unlock the 5th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/supermaterial.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[4]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Fused',
        description: 'Unlock the 6th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/fusion.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[5]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Quantum Flux',
        description: 'Unlock the 7th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/quantum.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[6]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Fountain of Youth',
        description: 'Unlock the 8th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/immortality.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[7]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Time and Space',
        description: 'Unlock the 9th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/tachyon.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[8]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Gravity Well',
        description: 'Unlock the 10th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/graviton.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[9]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Diliuted',
        description: 'Unlock the 11th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/dilithium.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[10]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Prodigy Child',
        description: 'Unlock the 12th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/prodigy.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[11]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Terraforming Mars',
        description: 'Unlock the 13th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/terraform.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[12]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Anti Anti Matter',
        description: 'Unlock the 14th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/antimatter.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[13]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Moar Matter',
        description: 'Unlock the 15th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/darkmatter.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[14]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'AEgg',
        description: 'Unlock the 16th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/ai.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[15]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Nebulous',
        description: 'Unlock the 17th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/nebula.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[16]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Universal Problem',
        description: 'Unlock the 18th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/universe.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[17]},
        hiddenImg: 'Eggs/question.png'
    },
    {
        name: 'Egglightenment',
        description: 'Unlock the 19th egg',
        hidden: true,
        group: 'eggs',
        img: 'Eggs/enlightenment.png',
        unlockCondition: () => {return gameState.data.progression.unlockedEgg[18]},
        hiddenImg: 'Eggs/question.png'
    },
    // Contracts
    {
        name: 'Contracted',
        description: 'Complete a Contract',
        hidden: false,
        group: 'contracts',
        img: 'greencheck.png',
        unlockCondition: () => {return gameState.data.stats.contractsComplete.gte(1)}
    },
    {
        name: 'Contractual',
        description: 'Complete 10 Contracts',
        hidden: false,
        group: 'contracts',
        img: 'greencheck.png',
        unlockCondition: () => {return gameState.data.stats.contractsComplete.gte(10)}
    },
    {
        name: 'Contractful',
        description: 'Complete 100 Contracts',
        hidden: false,
        group: 'contracts',
        img: 'greencheck.png',
        unlockCondition: () => {return gameState.data.stats.contractsComplete.gte(100)}
    },
    {
        name: 'Contractor',
        description: 'Complete 250 Contracts',
        hidden: false,
        group: 'contracts',
        img: 'greencheck.png',
        unlockCondition: () => {return gameState.data.stats.contractsComplete.gte(250)}
    },
    // Prestige (Soul Eggs & Prophecy Eggs)
    {
        name: 'You got a Soul',
        description: 'Get 1 Thousand Soul Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/soul.png',
        unlockCondition: () => {return gameState.data.currency.soulEggs.gte(1e3)}
    },
    {
        name: 'Quite a few Souls',
        description: 'Get 1 Million Soul Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/soul.png',
        unlockCondition: () => {return gameState.data.currency.soulEggs.gte(1e6)}
    },
    {
        name: 'Lotta Souls',
        description: 'Get 1 Billion Soul Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/soul.png',
        unlockCondition: () => {return gameState.data.currency.soulEggs.gte(1e9)}
    },
    {
        name: 'No More Souls Please',
        description: 'Get 1 Trillion Soul Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/soul.png',
        unlockCondition: () => {return gameState.data.currency.soulEggs.gte(1e12)}
    },
    {
        name: 'Elijah',
        description: 'Get 10 Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/prophecy.png',
        unlockCondition: () => {return gameState.data.currency.prophecyEggs.gte(10)}
    },
    {
        name: 'Elisha',
        description: 'Get 100 Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/prophecy.png',
        unlockCondition: () => {return gameState.data.currency.prophecyEggs.gte(100)}
    },
    {
        name: 'Daniel',
        description: 'Get 1 Thousand Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/prophecy.png',
        unlockCondition: () => {return gameState.data.currency.prophecyEggs.gte(1e3)}
    },
    {
        name: 'Isaiah',
        description: 'Get 10 Thousand Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Eggs/prophecy.png',
        unlockCondition: () => {return gameState.data.currency.prophecyEggs.gte(1e4)}
    },
    // Eggspeditions (Planets)
    {
        name: 'Energy Too',
        description: 'Discover Arcturus',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet1.png',
        unlockCondition: () => {return gameState.data.progression.planets[0]},
        hiddenImg: 'questionplanet.png'
    },
    {
        name: 'Outta Time',
        description: 'Discover Ravnar',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet2.png',
        unlockCondition: () => {return gameState.data.progression.planets[1]},
        hiddenImg: 'questionplanet.png'
    },
    {
        name: 'At last. Peace',
        description: 'Discover Xylok',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet3.png',
        unlockCondition: () => {return gameState.data.progression.planets[2]},
        hiddenImg: 'questionplanet.png'
    },
    {
        name: 'The Void',
        description: 'Discover Triton',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet4.png',
        unlockCondition: () => {return gameState.data.progression.planets[3]},
        hiddenImg: 'questionplanet.png'
    },
    {
        name: 'Great Balls of Fire!',
        description: 'Discover Hereth',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet5.png',
        unlockCondition: () => {return gameState.data.progression.planets[4]},
        hiddenImg: 'questionplanet.png'
    },
    {
        name: 'Aaaaa Light Mode',
        description: 'Discover Malak',
        hidden: true,
        group: 'eggspeditions',
        img: 'planet6.png',
        unlockCondition: () => {return gameState.data.progression.planets[5]},
        hiddenImg: 'questionplanet.png'
    },
    // Ascension
    {
        name: 'Ascendance',
        description: 'Obtain 1 Knowlegg',
        hidden: false,
        group: 'ascension',
        img: 'Eggs/knowlegg.png',
        unlockCondition: () => {return gameState.data.stats.bestKnowleggs.gte(1)}
    },
    {
        name: 'Knowledge is the Key',
        description: 'Obtain 10 Knowleggs',
        hidden: false,
        group: 'ascension',
        img: 'Eggs/knowlegg.png',
        unlockCondition: () => {return gameState.data.stats.bestKnowleggs.gte(10)}
    },
    {
        name: 'Lightbulb...',
        description: 'Obtain 25 Knowleggs',
        hidden: false,
        group: 'ascension',
        img: 'Eggs/knowlegg.png',
        unlockCondition: () => {return gameState.data.stats.bestKnowleggs.gte(25)}
    },
    {
        name: 'Library of Alexandria',
        description: 'Obtain 50 Knowleggs',
        hidden: false,
        group: 'ascension',
        img: 'Eggs/knowlegg.png',
        unlockCondition: () => {return gameState.data.stats.bestKnowleggs.gte(50)}
    },
    {
        name: 'Dusty Garbage',
        description: 'Acquire your first Tier I Artifact',
        hidden: false,
        group: 'ascension',
        img: 'Fragmented.png',
        unlockCondition: () => {return ownsArtifactTier(0)}
    },
    {
        name: 'Restoration Expert',
        description: 'Acquire your first Tier II Artifact',
        hidden: false,
        group: 'ascension',
        img: 'Restored.png',
        unlockCondition: () => {return ownsArtifactTier(1)}
    },
    {
        name: 'Master Reforger',
        description: 'Acquire your first Tier III Artifact',
        hidden: false,
        group: 'ascension',
        img: 'Upgraded.png',
        unlockCondition: () => {return ownsArtifactTier(2)}
    },
    {
        name: 'Ultimate Craftsman',
        description: 'Acquire your first Tier IV Artifact',
        hidden: false,
        group: 'ascension',
        img: 'Gilded.png',
        unlockCondition: () => {return ownsArtifactTier(3)}
    },
    {
        name: 'Scrounger',
        description: 'Acquire a Gem Fragment',
        hidden: false,
        group: 'ascension',
        img: 'Gems/Knowledge-Fragment.png',
        unlockCondition: () => {return ownsGemTier(0)}
    },
    {
        name: 'Gemsmith',
        description: 'Acquire a Gem Shard',
        hidden: false,
        group: 'ascension',
        img: 'Gems/Soul-Shard.png',
        unlockCondition: () => {return ownsGemTier(1)}
    },
    {
        name: 'Gemologist',
        description: 'Acquire a Gemstone',
        hidden: false,
        group: 'ascension',
        img: 'Gems/Ascension-Gem.png',
        unlockCondition: () => {return ownsGemTier(2)}
    },
    {
        name: 'Anti-Prophecy Club',
        description: 'Prestige with No Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Achievements/Anti1.png',
        unlockCondition: () => {return gameState.data.progression.hasPrestiged && gameState.data.currency.prophecyEggs.eq(0)}
    },
    {
        name: 'Anti-Anti-Anti-Prophecy Club',
        description: 'Ascend with No Prophecy Eggs',
        hidden: false,
        group: 'prestige',
        img: 'Achievements/Anti2.png',
        unlockCondition: () => {return gameState.data.progression.hasAscended && gameState.data.currency.prophecyEggs.eq(0)}
    },
    {
        name: 'Hoarder',
        description: 'Get your Artifact Collection Bonus to 100x',
        hidden: false,
        group: 'ascension',
        img: 'Achievements/Hoarder.png',
        unlockCondition: () => {return collectionBonus().gte(100)}
    },
    {
        name: 'Extraction Specialist',
        description: 'Get all Harvesters to Level 20',
        hidden: false,
        group: 'ascension',
        img: 'Achievements/Extractor.png',
        unlockCondition: () => {return allHarvestersAtLevel(20)}
    },
    {
        name: 'The Collector',
        description: 'Collect All of the Max Tier Gems & Artifacts',
        hidden: false,
        group: 'ascension',
        img: 'Achievements/Collector.png',
        unlockCondition: () => {return collectedMaxTierItems()}
    }
]


for(let i = 0; i < blankIndices.length; i++) {
    achievements.splice(blankIndices[i],0,blankObj)
}

const blankPadding = achievements.length % 8
for(let i = 0; i < blankPadding; i++) {
    achievements.push(blankObj)
}
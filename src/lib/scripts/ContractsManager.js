import Decimal from "break_eternity.js"

export const gradeNames = ["D","C","B","A","AA","AAA"] // AAA locked behind Ascension
const gradePointBudgets = [1,3,5,10,15,20] // How many points can be spent on a contract per grade
export const gradeWalls = [new Decimal(1000),new Decimal(2500),new Decimal(5000),new Decimal(7500), new Decimal(10000)]
const baseRepGain = [10,50,100,1000,2500]
const expiryTimeInMinutes = 180 // 3 Hours from creation to expiration

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
 *  modifiers: Array(Array(2)) -> [modifierIndex,debuffIndex]
 *  repGain: baseRep[gradeIndex] * (Grade Penalty/Bonus - 0.25 per level below or 0.25 per level above) * 
 * }
 */
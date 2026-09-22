const commonResearches = [
    {
      name: 'Comfortable Nests',
      desc: 'Egg Laying Rate +10%',
      maxLevel: D(50),
      baseCost: D(0.5)
    },
    {
      name: 'Nutritional Supplements',
      desc: 'Egg Value +25%',
      maxLevel: D(40),
      baseCost: D(1.16)
    },
    {
      name: 'Internal Hatcheries',
      desc: '+8 Chickens/min',
      maxLevel: Decimal.dTen,
      baseCost: D(1836)
    },
    {
      name: 'Padded Packaging',
      desc: 'Earnings Per Egg +25%',
      maxLevel: D(30),
      baseCost: D(454986)
    },
    {
      name: 'Bigger Eggs',
      desc: 'Doubles Egg Value',
      maxLevel: Decimal.dOne,
      baseCost: D(1351894)
    },
    {
      name: 'Internal Hatchery Upgrades',
      desc: '+20 Chickens/min',
      maxLevel: Decimal.dTen,
      baseCost: D(16029660)
    },
    {
      name: 'USDE Prime Certification',
      desc: 'Triples Egg Value',
      maxLevel: Decimal.dOne,
      baseCost: D(32.318e12)
    },
    {
      name: 'Hen House A/C',
      desc: 'Egg Laying Rate +5%',
      maxLevel: D(50),
      baseCost: D(2986194)
    },
    {
      name: 'Super-Feed™ Diet',
      desc: 'Egg Value +25%',
      maxLevel: D(35),
      baseCost: D(530.5e6)
    },
    {
      name: 'Internal Hatchery Expansion',
      desc: '+40 Chickens/min',
      maxLevel: D(15),
      baseCost: D(2.886e12)
    },
    {
      name: 'Improved Genetics',
      desc: 'Egg Laying Rate & Egg Value + 15%',
      maxLevel: D(30),
      baseCost: D(7.488e12)
    },
    {
      name: 'Shell Fortification',
      desc: 'Egg Value +15%',
      maxLevel: D(60),
      baseCost: D(14.738e15)
    },
    {
      name: 'Even Bigger Eggs',
      desc: 'Doubles Egg Value',
      maxLevel: D(5),
      baseCost: D(28.608e18)
    },
    {
      name: 'Internal Hatchery Expansion',
      desc: '+100 Chickens/min',
      maxLevel: D(30),
      baseCost: D(3.30094e17)
    },
    {
      name: 'Genetic Purification',
      desc: 'Egg Value +10%',
      maxLevel: D(100),
      baseCost: D(1.12026e20)
    },
    {
      name: 'Machine Learning Incubators',
      desc: '+20 Chickens/min',
      maxLevel: D(250),
      baseCost: D(1.4517e20)
    },
    {
      name: 'Time Compression',
      desc: 'Egg Laying Rate +10%',
      maxLevel: D(20),
      baseCost: D(3.4476e25)
    },
    {
      name: 'Graviton Coating',
      desc: 'Double Egg Density (Value)',
      maxLevel: D(7),
      baseCost: D(7.8316e24)
    },
    {
      name: 'Crystalline Shelling',
      desc: 'Egg Value +25%',
      maxLevel: D(100),
      baseCost: D(2.4606e30)
    },
    {
      name: 'Neural Linking',
      desc: '+200 Chickens/min',
      maxLevel: D(30),
      baseCost: D(7.02028e29)
    },
    {
      name: 'Telepathic Will',
      desc: 'Egg Quality (Value) +25%',
      maxLevel: D(50),
      baseCost: D(7.02028e29)
    },
    {
      name: 'Atomic Purification',
      desc: 'Egg Value +10%',
      maxLevel: D(3),
      baseCost: D(4.43336e36)
    },
    {
      name: 'Multiversal Layering',
      desc: '10x Egg Value',
      maxLevel: D(50),
      baseCost: D(2.2392e42)
    },
    {
      name: 'Timeline Diversion',
      desc: 'Egg Laying Rate +2%',
      maxLevel: D(25),
      baseCost: D(2.3596e47)
    },
    {
      name: 'Eggsistor Miniaturization',
      desc: 'Egg Value +5%',
      maxLevel: D(100),
      baseCost: D(1.7914e47)
    },
    {
      name: 'Matter Reconfiguration',
      desc: 'Increases Egg Value +1%',
      maxLevel: D(15),
      baseCost: D(1.5902e51)
    },
    {
      name: 'Timeline Splicing',
      desc: '10x Egg Value',
      maxLevel: D(16),
      baseCost: D(1.6564e66)
    },
    {
      name: 'Relativity Optimization',
      desc: 'Egg Laying Rate +10%',
      maxLevel: D(14),
      baseCost: D(1.4474e54)
    }
]

const epicResearches = [
    {
      name: 'Epic Internal Hatcheries',
      desc: 'Increase Chicken Gain by 5%',
      maxLevel: D(20),
      baseCost: D(100)
    },
    {
      name: 'Lab Upgrade',
      desc: 'Reduce Research Costs by 5%',
      maxLevel: Decimal.dTen,
      baseCost: D(1e5)
    },
    {
      name: 'Soul Food',
      desc: 'Increase Soul Egg Bonus by 1%',
      maxLevel: D(140),
      baseCost: D(1e6)
    },
    {
      name: 'Prestige Bonus',
      desc: '+10% More Soul Eggs per Prestige',
      maxLevel: D(20),
      baseCost: D(5e6)
    },
    {
      name: 'Epic Comfy Nests',
      desc: 'Egg Laying Rate +5%',
      maxLevel: D(20),
      baseCost: D(1e3)
    },
    {
      name: 'Accounting Tricks',
      desc: 'Increase Egg Value by 5%',
      maxLevel: D(20),
      baseCost: D(1e3)
    },
    {
      name: 'Tier I-V Automator',
      desc: 'Automate Tier I-V Research',
      maxLevel: Decimal.dOne,
      baseCost: D(1e4)
    },
    {
      name: 'Tier VI-X Automator',
      desc: 'Automate Tier VI-X Research',
      maxLevel: Decimal.dOne,
      baseCost: D(1e7)
    },
    {
      name: 'Start with 1 Chicken',
      desc: 'Start with 1 Chicken on any Reset',
      maxLevel: Decimal.dOne,
      baseCost: D(1e6)
    },
    {
      name: 'Promotion Automator',
      desc: 'Automatic Promotions',
      maxLevel: Decimal.dOne,
      baseCost: D(1e9)
    },
    {
      name: 'Tier XI-XIV Automator',
      desc: 'Automated Tier XI-XIV Research',
      maxLevel: Decimal.dOne,
      baseCost: D(1e9)
    }
]

const legendaryResearches = [
  {
    name: 'Planetary Discovery',
    description: 'Unlock a final planet for discovery',
    max: Decimal.dOne,
    baseCost: Decimal.dOne
  },
  {
    name: 'Basic Harvesting & Artifacts',
    description: 'Unlock Harvesters & The Reliquary',
    max: Decimal.dOne,
    baseCost: Decimal.dTen
  },
  {
    name: 'Epic Research Autobuyer',
    description: 'Automatically Purchase Epic Researches',
    max: Decimal.dOne,
    baseCost: Decimal.dTen
  },
  {
    name: 'Upgraded Harvesters',
    description: '+5 More Levels to Harvester Level Cap\nUnlock Tier II Artifacts & Tier I Gems\nAnd Reliquary Loadouts & Statistics',
    max: Decimal.dOne,
    baseCost: D(15)
  },
  {
    name: 'Advanced Harvesters',
    description: '+5 More Levels to Harvester Level Cap\nUnlock Tier III Artifacts & Tier II Gems',
    max: Decimal.dOne,
    baseCost: D(20)
  },
  {
    name: 'Superior Harvesters',
    description: '+5 More Levels to Harvester Level Cap\nUnlock Tier IV Artifacts & Tier III Gems',
    max: Decimal.dOne,
    baseCost: D(25)
  },
]
let commonResearchCost = new Array(commonResearches.length).fill(Decimal.dZero)
let commonResearchCostDisplay = new Array(commonResearches.length).fill(Decimal.dZero)
let epicResearchCost = new Array(epicResearches.length).fill(Decimal.dZero)
let epicResearchCostDisplay = new Array(epicResearches.length).fill(Decimal.dZero)
let legendaryResearchCost = new Array(legendaryResearches.length).fill(Decimal.dZero)
let legendaryResearchCostDisplay = new Array(legendaryResearches.length).fill(Decimal.dZero)

for(let i = 0; i < commonResearches.length; i++) {
    commonResearchCost[i] = ((commonResearches[i].baseCost).sub(commonResearches[i].baseCost.times(D(0.05).times(data.epicResearch[1])))) //Base Cost Calc
    if(data.onPlanet === false)
        commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.15, data.research[i]))
    else if(data.onPlanet === true && data.currentPlanetIndex === 0)
        commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.35, data.research[i]))
    DOMCacheGetOrSet(`r${i}`).innerText = `${commonResearches[i].name}\n${commonResearches[i].desc}\nLevel: ${format(data.research[i],0)}/${format(commonResearches[i].maxLevel,0)}\n
    Cost: $${format(commonResearchCost[i])}`

}

function updateCommonResearchHTML() {
  for(let i = 0; i < commonResearchCost.length; i++) {
    if(data.research[i].lt(commonResearches[i].maxLevel)) {
      if(data.buyAmounts[0] === 0)
        DOMCacheGetOrSet(`r${i}`).classList = data.money.gte(commonResearchCostDisplay[i]) ? 'greenButton' : 'redButton'
      else if(data.buyAmounts[0] !== 0 && data.money.gte(commonResearchCost[i]))
        DOMCacheGetOrSet(`r${i}`).classList = data.money.gte(commonResearchCostDisplay[i]) ? 'greenButton' : 'yellowButton'
      else
        DOMCacheGetOrSet(`r${i}`).classList = 'redButton'
  }
  else
    DOMCacheGetOrSet(`r${i}`).classList = 'blueButton'
    DOMCacheGetOrSet(`r${i}`).innerText = data.research[i].lt(commonResearches[i].maxLevel) ? `${commonResearches[i].name}\n${commonResearches[i].desc}\nLevel: ${toPlaces(data.research[i],0,commonResearches[i].maxLevel.add(Decimal.dOne))}/${toPlaces(commonResearches[i].maxLevel,0,commonResearches[i].maxLevel.add(Decimal.dOne))}\nCost: $${format(commonResearchCostDisplay[i])}` : `${commonResearches[i].name}\n${commonResearches[i].desc}\nLevel: ${toPlaces(data.research[i],0,commonResearches[i].maxLevel.add(Decimal.dOne))}/${toPlaces(commonResearches[i].maxLevel,0,commonResearches[i].maxLevel.add(Decimal.dOne))}\nCost: [MAXED]`
  }
}

function purchaseResearch(i) {
    updateResearch()
    let buyAmount = data.research[i].add(BUY_AMOUNT_NUMBERS[data.buyAmounts[0]]).lte(commonResearches[i].maxLevel) ? BUY_AMOUNT_NUMBERS[data.buyAmounts[0]] : commonResearches[i].maxLevel.sub(data.research[i]);
    // prevent going over max level
    let costMult = Decimal.pow(1.15, buyAmount).sub(Decimal.dOne).div(0.15);
    //calculate cost of buying buyAmount researches
    if(data.money.lt(commonResearchCost[i].times(costMult))) {
        buyAmount = Math.floor(data.money.div(commonResearchCost[i]).times(0.15).add(Decimal.dOne).log(1.15).toNumber());
        //reverse function to get maximum buyAmount
        costMult = Decimal.pow(1.15, buyAmount).sub(Decimal.dOne).div(0.15);
    }
    data.money = data.money.sub(commonResearchCost[i].times(costMult));
    data.research[i] = data.research[i].add(buyAmount);
}
function updateResearch() {
    for(let i = 0; i < commonResearches.length; i++) {
      commonResearchCost[i] = ((commonResearches[i].baseCost).sub(commonResearches[i].baseCost.times(D(0.05).times(data.epicResearch[1])))) //Base Cost Calc
      commonResearchCostDisplay[i] = getTotalCost(commonResearchCost[i],data.onPlanet === true && data.currentPlanetIndex === 0 ? D(1.35) : D(1.15),data.research[i],commonResearches[i].maxLevel,D(BUY_AMOUNT_NUMBERS[data.buyAmounts[0]]))
      if(data.onPlanet === false)
        commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.15, data.research[i]))
      else if(data.onPlanet === true && data.currentPlanetIndex === 0)
        commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.35, data.research[i]))
      commonResearchCost[i] = commonResearchCost[i].div(getActiveArtifactBoost(5))
      commonResearchCostDisplay[i] = commonResearchCostDisplay[i].div(getActiveArtifactBoost(5))
    }
        
    for(let i = 0; i < epicResearches.length; i++) {
        epicResearchCost[i] = epicResearches[i].baseCost.times(Decimal.pow(1.25, data.epicResearch[i]))
        epicResearchCostDisplay[i] = getTotalCost(epicResearches[i].baseCost,D(1.25),data.epicResearch[i],epicResearches[i].maxLevel,D(BUY_AMOUNT_NUMBERS[data.buyAmounts[1]]))
    }
    
    for(let i = 0; i < legendaryResearches.length; i++) {
        legendaryResearchCost[i] = legendaryResearches[i].baseCost.times(Decimal.pow(1.45,data.legendaryResearch[i]))
        legendaryResearchCostDisplay[i] = getTotalCost(legendaryResearches[i].baseCost,D(1.45),data.legendaryResearch[i],legendaryResearches[i].max,D(BUY_AMOUNT_NUMBERS[data.buyAmounts[2]]))
    }
}
//Epic Section

for(let i = 0; i < epicResearches.length; i++) {
    epicResearchCost[i] = epicResearches[i].baseCost.times(Decimal.pow(1.25, data.epicResearch[i]))
    DOMCacheGetOrSet(`er${i}`).innerText = `${epicResearches[i].name}\n${epicResearches[i].desc}\nLevel: ${format(data.epicResearch[i],0)}/${format(epicResearches[i].maxLevel,0)}\n
    Cost: ${format(epicResearchCost[i])} Soul Eggs`
}
function purchaseEpicResearch(i) {
    for(let j = 0; j < BUY_AMOUNT_NUMBERS[data.buyAmounts[1]]; j++) {
        updateResearch()
        if(data.soulEggs.gte(epicResearchCost[i]) && data.epicResearch[i].lt(epicResearches[i].maxLevel)) {
            data.soulEggs = data.soulEggs.sub(epicResearchCost[i])
            data.epicResearch[i] = data.epicResearch[i].add(Decimal.dOne)
            updateHTML()
        }
        else
            break
    }
}

function purchaseLegendaryResearch(i) {
  if(data.legendaryResearch[i].gte(legendaryResearches[i].max)) return
    for(let j = 0; j < BUY_AMOUNT_NUMBERS[data.buyAmounts[2]]; j++) {
        updateResearch()
        if(data.knowlegg.gte(legendaryResearchCost[i]) && data.legendaryResearch[i].lt(legendaryResearches[i].max)) {
            data.knowlegg = data.knowlegg.sub(legendaryResearchCost[i])
            data.legendaryResearch[i] = data.legendaryResearch[i].add(Decimal.dOne)
            updateHTML()
        }
        else
            break
    }
}

function isCommonResearchMaxed(start,end) {
  for(let i = start; i <= end; i++) {
    if(data.research[i].lt(commonResearches[i].maxLevel)) return false
  }
  return true
}

function isEpicResearchMaxed(start,end) {
  for(let i = start; i <= end; i++) {
    if(data.epicResearch[i].lt(epicResearches[i].maxLevel)) return false
  }
  return true
}

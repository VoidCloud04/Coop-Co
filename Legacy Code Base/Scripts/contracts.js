const prestigeContracts = [
    {
      name: 'Energy Crisis',
      desc: 'A Californian Energy Shortage means more demand for Fusion Eggs.',
      eggIndex: 5,
      baseGoal: D(1e17),
      baseReward: D(5),
    },
    {
      name: 'GPT-10.0',
      desc: 'To make the ultimate version of ChatGPT, AI Eggs are needed',
      eggIndex: 15,
      baseGoal: D(1e25),
      baseReward: Decimal.dTen,
    },
    {
      name: 'Pandemic',
      desc: 'A Pandemic is covering the world, Medical Eggs are needed to save lives.',
      eggIndex: 2,
      baseGoal: D(1e15),
      baseReward: D(0.35),
    },
    {
      name: 'Supreme Diets',
      desc: 'Dieting is back in fashion people need more Superfood Eggs.',
      eggIndex: 1,
      baseGoal: D(1e13),
      baseReward: D(0.25),
    },
    {
      name: 'Fountain of Youth',
      desc: 'People are wanting to stay youthful, Immortality Eggs are needed to keep them that way.',
      eggIndex: 7,
      baseGoal: D(1e19),
      baseReward: D(5.5)
    },
    {
      name: 'Supply Chain Crisis',
      desc: 'Supply Chain Issues have caused resource shortages, Supermaterial Eggs are needed to offset the shortage.',
      eggIndex: 4,
      baseGoal: D(1e16),
      baseReward: D(0.5),
    },
    {
      name: 'Temporal Tear',
      desc: 'A Temporal Tear has caused a rift in the space-time continuum, Tachyon Eggs are needed to fix it.',
      eggIndex: 8,
      baseGoal: D(1e20),
      baseReward: D(6),
    },
    {
      name: 'Space-Egg',
      desc: 'Egglon Musk needs massive amounts of rocketfuel eggs for his new Chicken-9 Rocket',
      eggIndex: 3,
      baseGoal: D(1e16),
      baseReward: D(0.45),
    },
    {
      name: 'Terraforming Venus',
      desc: 'In order to terraform all of Venus we need mass production of Terraform Eggs',
      eggIndex: 12,
      baseGoal: D(1e23),
      baseReward: D(7),
    },
]

function updateContractsHTML() {
  for(let i = 0; i < 3; i++) {
    if(data.contracts[i].id === -1) {
      DOMCacheGetOrSet(`infContractTitle${i}`).innerText = 'No Contract'
      DOMCacheGetOrSet(`infContractDesc${i}`).innerText = 'No Contract'
      DOMCacheGetOrSet(`infContractGoal${i}`).innerText = 'No Contract'
      DOMCacheGetOrSet(`infContractReward${i}`).innerText = 'No Contract'
      DOMCacheGetOrSet(`infContractButton${i}`).innerText = 'No Contract'
    } else {
      DOMCacheGetOrSet(`infContractTitle${i}`).innerText = prestigeContracts[data.contracts[i].id].name
      DOMCacheGetOrSet(`infContractDesc${i}`).innerText = prestigeContracts[data.contracts[i].id].desc
      DOMCacheGetOrSet(`infContractGoal${i}`).innerHTML = `Goal: <span style="color:var(--green)">$${format(data.contracts[i].goal)}</span>`
      DOMCacheGetOrSet(`infContractReward${i}`).innerHTML = `Reward: <span style="color:var(--yellow)">${format(data.contracts[i].reward)} Prophecy Eggs</span>`
    }
    if(contractActive() || data.onPlanet || data.contracts[i].id === -1) {
      DOMCacheGetOrSet(`infContractButton${i}`).innerText = !data.contractActive[i] ? 'Can\'t Start' : 'Exit Contract'
      DOMCacheGetOrSet(`infContractButton${i}`).classList = !data.contractActive[i] ? 'redButton' : 'greenButton'
    }
    else {
      DOMCacheGetOrSet(`infContractButton${i}`).innerText = 'Start Contract'
      DOMCacheGetOrSet(`infContractButton${i}`).classList = 'greenButton'
    }
  }    
}


function contractActive(){
  for(let x=0;x<data.contractActive.length;x++){
    if(data.contractActive[x])return true
  }
  return false
}

function generateContract(i) {
    let id = getRandom(0, prestigeContracts.length)
    while(!data.unlockedEgg[prestigeContracts[id].eggIndex]) {
      id = getRandom(0, prestigeContracts.length)
    }
    if(id > prestigeContracts.length - 1) index = prestigeContracts.length - 1
    /*
        const contractBaseReward = prestigeContracts[id].baseGoal.lte(1e18) ?  
    (D(50).times(prestigeContracts[id].baseGoal.div(D(1e18).sub(1e10))).add(1)).times(data.stats.contractsComplete) :
    (D(50).times(prestigeContracts[id].baseGoal.div(D(1e25).sub(1e20))).add(50)).times(Decimal.sqrt(data.stats.contractsComplete))
    */
    const contractBaseReward = Decimal.log(prestigeContracts[id].baseGoal,3).times(Decimal.sqrt(data.stats.contractsComplete))
    let goal = (prestigeContracts[id].baseGoal.times((eggData[prestigeContracts[id].eggIndex].value))).times(contractGoalBoost.times(soulEggBoost))
    let reward = (contractBaseReward.times(Decimal.dOne.add(Decimal.log2(contractGoalBoost)))).add(1)
    data.contracts[i].id = id
    data.contracts[i].goal = goal
    data.contracts[i].reward = reward
}

function startContract(i) {
    if(data.onPlanet || data.contracts[i].id === -1 || (contractActive() && !data.contractActive[i])) return
    if(!data.contractActive[i]) {
      prestige()
      data.currentEgg = prestigeContracts[data.contracts[i].id].eggIndex
      data.contractActive[i] = true
      if(data.settingsToggles[2]) 
        generateNotification(`Contract ${prestigeContracts[data.contracts[i].id].name} Started!`, 'warn')
    }
    else {
      data.contractActive[i] = false
      for(let i = 0; i < data.research.length; i++)
        data.research[i] = Decimal.dZero
      eggValueBonus = Decimal.dOne
      chickenGain = Decimal.dZero
      layRate = Decimal.dOne
      data.chickens = Decimal.dZero
      data.money = Decimal.dZero
      data.currentEgg = 0
      if(data.settingsToggles[2] === true) 
        generateNotification(`Contract ${prestigeContracts[data.contracts[i].id].name} Left!`, 'warn')
    }
}

function runContract(i) {
    if(data.money.gte(data.contracts[i].goal)) {
      data.contractActive[i] = false
      data.prophecyEggs = data.prophecyEggs.add(data.contracts[i].reward)
      if(data.settingsToggles[2] === true) 
        generateNotification(`Contract ${prestigeContracts[data.contracts[i].id].name} Completed!\n+${format(data.contracts[i].reward)} Prophecy Eggs`, 'success')
      for(let i = 0; i < 3; i++)
        generateContract(i)
      for(let i = 0; i < data.research.length; i++)
        data.research[i] = Decimal.dZero
      eggValueBonus = Decimal.dOne
      chickenGain = Decimal.dZero
      layRate = Decimal.dOne
      data.chickens = Decimal.dZero
      data.money = Decimal.dZero
      data.currentEgg = 0
      data.stats.contractsComplete = data.stats.contractsComplete.add(Decimal.dOne)
    }
}

let selectingArtifactGem = {status: false, type: null, slotID: -1}
let artifactHoverIndex = {id: -1, type: null}
let harvesterHoverIndex = -1
let harvesterMaxLevel = 0
let selectedLoadout = -1
let harvesterUpgradeCosts = new Array(6).fill(Decimal.dZero)
let knowleggBoost = Decimal.dOne
let collectionBoost = Decimal.dOne
// Crafting Item Object {id,type,count}
const artifacts = [
    {
        name: 'Eggcell \'85',
        img: 'Images/Artifacts/Eggcell-85.png',
        crafting: [],
        effect: D(1.0)
    },
    {
        name: 'Quickeggn',
        img: 'Images/Artifacts/Quickeggn.png',
        crafting: [
            {id:0,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(1.5)
    },
    {
        name: 'Egg Books',
        img: 'Images/Artifacts/Egg-Books.png',
        crafting: [
            {id:1,type:'artifact',count:D(14)},
        ],
        effect: D(2)
    },
    {
        name: 'Turbo Hatch',
        img: 'Images/Artifacts/Turbo-Hatch.png',
        crafting: [
            {id:2,type:'artifact',count:D(18)},
        ],
        effect: D(5)
    },
    {
        name: 'Tattered Scroll',
        img: 'Images/Artifacts/Tattered-Scroll.png',
        crafting: [],
        effect: D(0.5)
    },
    {
        name: 'Prophetic Scroll',
        img: 'Images/Artifacts/Prophetic-Scroll.png',
        crafting: [
            {id:4,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(1.25)
    },
    {
        name: 'Gilded Scroll',
        img: 'Images/Artifacts/Gilded-Scroll.png',
        crafting: [
            {id:5,type:'artifact',count:D(14)},
        ],
        effect: D(49)
    },
    {
        name: 'Enlightened Scroll',
        img: 'Images/Artifacts/Enlightened-Scroll.png',
        crafting: [
            {id:6,type:'artifact',count:D(18)},
        ],
        effect: D(499)
    },
    {
        name: 'Prophetic Book',
        img: 'Images/Artifacts/Prophetic-Book.png',
        crafting: [],
        effect: D(0.5)
    },
    {
        name: 'Gilded Book',
        img: 'Images/Artifacts/Gilded-Book.png',
        crafting: [
            {id:8,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(0.75)
    },
    {
        name: 'Ascended Book',
        img: 'Images/Artifacts/Ascended-Book.png',
        crafting: [
            {id:9,type:'artifact',count:D(14)},
        ],
        effect: D(1)
    },
    {
        name: 'Knowlegg Book',
        img: 'Images/Artifacts/Knowlegg-Book.png',
        crafting: [
            {id:10,type:'artifact',count:D(18)},
        ],
        effect: D(2)
    },
    {
        name: 'Torn Lantern',
        img: 'Images/Artifacts/Torn-Lantern.png',
        crafting: [],
        effect: D(1)
    },
    {
        name: 'Soul Lantern',
        img: 'Images/Artifacts/Soul-Lantern.png',
        crafting: [
            {id:12,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(2.5)
    },
    {
        name: 'Gilded Lantern',
        img: 'Images/Artifacts/Gilded-Lantern.png',
        crafting: [
            {id:13,type:'artifact',count:D(14)},
        ],
        effect: D(5)
    },
    {
        name: 'Prestige Lantern',
        img: 'Images/Artifacts/Prestige-Lantern.png',
        crafting: [
            {id:14,type:'artifact',count:D(18)},
        ],
        effect: D(14)
    },
    {
        name: 'Hammer',
        img: 'Images/Artifacts/Hammer.png',
        crafting: [],
        effect: D(1)
    },
    {
        name: 'Hammer & Pick',
        img: 'Images/Artifacts/Hammer-Pick.png',
        crafting: [
            {id:16,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(1.5)
    },
    {
        name: 'Hammer & Wrench',
        img: 'Images/Artifacts/Hammer-Wrench.png',
        crafting: [
            {id:17,type:'artifact',count:D(14)},
        ],
        effect: D(2)
    },
    {
        name: 'Crane',
        img: 'Images/Artifacts/Crane.png',
        crafting: [
            {id:18,type:'artifact',count:D(18)},
        ],
        effect: D(4)
    },
    {
        name: 'Ancient Analysis',
        img: 'Images/Artifacts/Alembic.png',
        crafting: [],
        effect: D(0.5)
    },
    {
        name: 'Basic Analysis',
        img: 'Images/Artifacts/Chemical-Tube.png',
        crafting: [
            {id:20,type:'artifact',count:Decimal.dTen},
        ],
        effect: D(1)
    },
    {
        name: 'Advanced Analysis',
        img: 'Images/Artifacts/Production-Tube.png',
        crafting: [
            {id:21,type:'artifact',count:D(14)},
        ],
        effect: D(2)
    },
    {
        name: 'Superior Analysis',
        img: 'Images/Artifacts/Microscope.png',
        crafting: [
            {id:22,type:'artifact',count:D(18)},
        ],
        effect: D(4)
    }
]

const gems = [
    {
        name: 'Knowledge Fragment',
        img: 'Images/Gems/Knowledge-Fragment.png',
        crafting: [],
        effect: D(0.25)
    },
    {
        name: 'Knowledge Shard',
        img: 'Images/Gems/Knowledge-Shard.png',
        crafting: [{id:0,type:'gem',count:D(20)}],
        effect: D(0.5)
    },
    {
        name: 'Knowledge Gem',
        img: 'Images/Gems/Knowledge-Gem.png',
        crafting: [{id:1,type:'gem',count:D(30)},{id:17,type:'gem',count:Decimal.dTwo}],
        effect: D(1.0)
    },
    {
        name: 'Tachyon Fragment',
        img: 'Images/Gems/Tachyon-Fragment.png',
        crafting: [],
        effect: D(0.40)
    },
    {
        name: 'Tachyon Shard',
        img: 'Images/Gems/Tachyon-Shard.png',
        crafting: [{id:3,type:'gem',count:D(20)}],
        effect: D(0.60)
    },
    {
        name: 'Tachyon Gem',
        img: 'Images/Gems/Tachyon-Gem.png',
        crafting: [{id:4,type:'gem',count:D(12)}],
        effect: D(0.80)
    },
    {
        name: 'Antimatter Fragment',
        img: 'Images/Gems/Antimatter-Fragment.png',
        crafting: [],
        effect: D(0.20)
    },
    {
        name: 'Antimatter Shard',
        img: 'Images/Gems/Antimatter-Shard.png',
        crafting: [{id:6,type:'gem',count:D(20)}],
        effect: D(0.64)
    },
    {
        name: 'Antimatter Gem',
        img: 'Images/Gems/Antimatter-Gem.png',
        crafting: [{id:7,type:'gem',count:D(30)}],
        effect: D(0.85)
    },
    {
        name: 'Quantum Fragment',
        img: 'Images/Gems/Quantum-Fragment.png',
        crafting: [],
        effect: D(0.2)
    },
    {
        name: 'Quantum Shard',
        img: 'Images/Gems/Quantum-Shard.png',
        crafting: [{id:9,type:'gem',count:D(20)}],
        effect: D(0.40)
    },
    {
        name: 'Quantum Gem',
        img: 'Images/Gems/Quantum-Gem.png',
        crafting: [{id:10,type:'gem',count:D(15)}],
        effect: D(0.85)
    },
    {
        name: 'Soul Fragment',
        img: 'Images/Gems/Soul-Fragment.png',
        crafting: [],
        effect: D(0.25)
    },
    {
        name: 'Soul Shard',
        img: 'Images/Gems/Soul-Shard.png',
        crafting: [{id:12,type:'gem',count:D(20)}],
        effect: D(0.75)
    },
    {
        name: 'Soul Gem',
        img: 'Images/Gems/Soul-Gem.png',
        crafting: [{id:13,type:'gem',count:D(15)}],
        effect: D(1.0)
    },
    {
        name: 'Ascension Fragment',
        img: 'Images/Gems/Ascension-Fragment.png',
        crafting: [],
        effect: D(0.1)
    },
    {
        name: 'Ascension Shard',
        img: 'Images/Gems/Ascension-Shard.png',
        crafting: [{id:15,type:'gem',count:D(20)}],
        effect: D(0.25)
    },
    {
        name: 'Ascension Gem',
        img: 'Images/Gems/Ascension-Gem.png',
        crafting: [{id:16,type:'gem',count:D(15)},{id:14,type:'gem',count:Decimal.dTwo}],
        effect: D(0.5)
    },
]

const ingredients = []

let knowleggGain = Decimal.dOne
let legendaryResearchCosts = new Array(legendaryResearches.length).fill(Decimal.dZero)

function updateAscensionHTML() {
    if(data.currentSubTab[1] === 0) {
        DOMCacheGetOrSet(`knowleggText`).innerText = `${format(data.knowlegg)} Knowleggs\nEnlightenment Egg Value: x${format(knowleggBoost)}`
        for(let i = 0; i < legendaryResearches.length; i++) {
            DOMCacheGetOrSet(`lr${i}`).innerText = `${legendaryResearches[i].name}\n${legendaryResearches[i].description}\nLevel: ${toPlaces(data.legendaryResearch[i],0,data.legendaryResearch[i].add(Decimal.dOne))}/${toPlaces(legendaryResearches[i].max,0,legendaryResearches[i].max.add(Decimal.dOne))}\nCost: ${data.legendaryResearch[i].gte(legendaryResearches[i].max) ? '[MAXED]' : `${format(legendaryResearchCostDisplay[i])} Knowleggs`}`
            if(data.legendaryResearch[i].lt(legendaryResearches[i].max))
                DOMCacheGetOrSet(`lr${i}`).classList = data.knowlegg.gte(legendaryResearchCostDisplay[i]) ? 'orangeButton' : 'redButton'
            else
                DOMCacheGetOrSet(`lr${i}`).classList = 'blueButton'
        }
    }
    else if(data.currentSubTab[1] === 1) {
        for(let i = 0; i < 6; i++) {
            DOMCacheGetOrSet(`harvesterText${i}`).innerText = data.harvesters[i].level === 0 ? `Construct Harvester to Use` : `${planetNames[i]} Harvester - Level ${data.harvesters[i].level}`
            if(data.harvesters[i].level === 0) {
                DOMCacheGetOrSet(`harvesterButton${i}`).innerText = 'Locked'
                DOMCacheGetOrSet(`harvesterButton${i}`).classList = 'redButton'
            }
            else {
                DOMCacheGetOrSet(`harvesterButton${i}`).innerText = data.harvesters[i].timeRemaining > 0 ? `${formatTimeAlternate(data.harvesters[i].timeRemaining)}` : 'Run Harvester'
                DOMCacheGetOrSet(`harvesterButton${i}`).classList = data.harvesters[i].timeRemaining > 0 ? 'redButton' : 'greenButton'
            }
                
            DOMCacheGetOrSet('harvesterUpgradeButton').style.display = harvesterHoverIndex !== -1 ? 'block' : 'none'
            if(harvesterHoverIndex !== -1) {
                if(data.harvesters[harvesterHoverIndex].level < 20 && data.harvesters[harvesterHoverIndex].level < harvesterMaxLevel) {
                    DOMCacheGetOrSet('harvesterUpgradeButton').innerText = data.harvesters[harvesterHoverIndex].level === 0 ? `Construct Harvester` : `Upgrade Harvester`
                    DOMCacheGetOrSet('harvesterUpgradeButton').classList = data.planetData[harvesterHoverIndex].chickens.gte(harvesterUpgradeCosts[harvesterHoverIndex]) ? 'greenButton' : 'redButton'
                }
                else {
                    DOMCacheGetOrSet('harvesterUpgradeButton').innerText = 'Max Level'
                    DOMCacheGetOrSet('harvesterUpgradeButton').classList = 'blueButton'
                }
                
            }
        }
    }
    else if(data.currentSubTab[1] === 2) {

        for(let i = 0; i < data.activeArtifacts.length; i++) {

            if(data.activeArtifacts[i] !== -1 && DOMCacheGetOrSet(`artifactHolder${i}`).getAttribute('src') !== artifacts[data.activeArtifacts[i]].img)
                DOMCacheGetOrSet(`artifactHolder${i}`).setAttribute('src',artifacts[data.activeArtifacts[i]].img)
            else if(data.activeArtifacts[i] === -1 && DOMCacheGetOrSet(`artifactHolder${i}`).getAttribute('src') !== 'Images/blank.png')
                DOMCacheGetOrSet(`artifactHolder${i}`).setAttribute('src','Images/blank.png')


            if((!selectingArtifactGem.status && selectingArtifactGem.type !== 'artifact') || (selectingArtifactGem.status && selectingArtifactGem.type === 'artifact' && selectingArtifactGem.slotID !== i)) {
                DOMCacheGetOrSet(`artifactHolder${i}`).classList = data.activeArtifacts[i] !== -1 ? 'artifactHolder-active' : 'artifactHolder-inactive'
            }
            else if(selectingArtifactGem.status && selectingArtifactGem.type === 'artifact' && selectingArtifactGem.slotID === i) {
                DOMCacheGetOrSet(`artifactHolder${i}`).classList = 'artifactHolder-selected'
            }
        }

        for(let i = 0; i < data.activeGems.length; i++) {

            if(data.activeGems[i] !== -1 && DOMCacheGetOrSet(`gemHolder${i}`).getAttribute('src') !== gems[data.activeGems[i]].img)
                DOMCacheGetOrSet(`gemHolder${i}`).setAttribute('src',gems[data.activeGems[i]].img)
            else if(data.activeGems[i] === -1 && DOMCacheGetOrSet(`gemHolder${i}`).getAttribute('src') !== 'Images/blank.png')
                DOMCacheGetOrSet(`gemHolder${i}`).setAttribute('src','Images/blank.png')

            if(!gemSlotAvailable(i)) {
                DOMCacheGetOrSet(`gemHolder${i}`).classList = 'gemHolder-restricted'
            }
            else if((!selectingArtifactGem.status && selectingArtifactGem.type !== 'gem') || (selectingArtifactGem.status && selectingArtifactGem.type === 'gem' && selectingArtifactGem.slotID !== i)) {
                DOMCacheGetOrSet(`gemHolder${i}`).classList = data.activeGems[i] !== -1 ? 'gemHolder-active' : 'gemHolder-inactive'
            }
            else if(selectingArtifactGem.status && selectingArtifactGem.type === 'gem' && selectingArtifactGem.slotID === i) {
                DOMCacheGetOrSet(`gemHolder${i}`).classList = 'gemHolder-selected'
            }
        }

        for(let i = 0; i < data.unlockedArtifact.length; i++) {
            if(data.unlockedArtifact[i] && DOMCacheGetOrSet(`artifactSlot${i}`).getAttribute('src') !== artifacts[i].img)
                DOMCacheGetOrSet(`artifactSlot${i}`).src = artifacts[i].img
            else if(!data.unlockedArtifact[i] && DOMCacheGetOrSet(`artifactSlot${i}`).getAttribute('src') !== 'Images/QuestionMark.png')
                DOMCacheGetOrSet(`artifactSlot${i}`).src = 'Images/QuestionMark.png'
        }

        for(let i = 0; i < data.unlockedGem.length; i++) {
            if(data.unlockedGem[i] && DOMCacheGetOrSet(`gemSlot${i}`).getAttribute('src') !== gems[i].img)
                DOMCacheGetOrSet(`gemSlot${i}`).src = gems[i].img
            else if(!data.unlockedGem[i] && DOMCacheGetOrSet(`gemSlot${i}`).getAttribute('src') !== 'Images/QuestionMark.png')
                DOMCacheGetOrSet(`gemSlot${i}`).src = 'Images/QuestionMark.png'
        }
        if(artifactHoverIndex.id !== -1) {
            DOMCacheGetOrSet(`artifactCraftingInfo`).innerText = generateArtifactCraftingInfo(artifactHoverIndex.id,artifactHoverIndex.type)
            DOMCacheGetOrSet(`artifactCraftingButton`).classList = canCraftArtifact(artifactHoverIndex.id,artifactHoverIndex.type) ? 'greenButton' : 'redButton'
            DOMCacheGetOrSet(`artifactCraftingButton`).innerText = canCraftArtifact(artifactHoverIndex.id,artifactHoverIndex.type) ? 'Craft!' : 'Can\'t Craft'
        }
        DOMCacheGetOrSet(`artifactCraftingButton`).style.display = artifactHoverIndex.id !== -1 ? 'block' : 'none'
    }
    else if(data.currentSubTab[1] === 3) {
        DOMCacheGetOrSet('activeLoadoutText').innerText = selectedLoadout !== -1 ? `Active Loadout: #${data.currentLoadout+1}\nSelected Loadout: #${selectedLoadout+1}` : `Active Loadout: #${data.currentLoadout+1}\nSelected Loadout: None`
        DOMCacheGetOrSet('artifactBoostStats').innerText = `Egg Value: x${format((getActiveArtifactBoost(0)))}\n` + `Enlightenment Egg Value: x${format((getActiveArtifactBoost(1)))}\n` + `Prophecy Egg Boost: x${format(getActiveArtifactBoost(2))}\n` +
        `Soul Egg Boost: x${format((getActiveArtifactBoost(3).sub(Decimal.dOne)).times(100))}\n` + `Chicken Gain: x${format((getActiveArtifactBoost(4)))}\n` + `Research Cost: /${format((getActiveArtifactBoost(5)))}`
        DOMCacheGetOrSet('gemBoostStats').innerText = `Chicken Gain: x${format(getActiveGemBoost(1))}\n` + `Egg Value: x${format((getActiveGemBoost(2)))}\n` +
        `Egg Laying Rate: x${format(getActiveGemBoost(3))}\n` + `Soul Egg Bonus: x${format((getActiveGemBoost(4)))}\n` + `Prophecy Egg Bonus: x${format((getActiveGemBoost(5)))}`  
        DOMCacheGetOrSet('collectionBonusText').innerText = `Your "Collected" Artifacts multiply all artifact boosts by: ${format(collectionBoost)}`
    }
}

function updateAscension() {
    knowleggGain = data.money.gte(1e45) && data.currentEgg === 18 ? (data.bestRunMoney.div(1e45).log(20)).add(Decimal.dOne) : Decimal.dZero
    knowleggGain = knowleggGain.times(planetBoosts[2])
    knowleggBoost = ((data.knowlegg.add(data.bestKnowlegg)).div(2)).gt(0) ? D(1).add(Decimal.log((data.knowlegg.add(data.bestKnowlegg)).div(2),2)) : D(1)
    collectionBoost = calculateCollectionBonus()
    harvesterMaxLevel = 0
    harvesterMaxLevel += data.legendaryResearch[0].gte(legendaryResearches[0].max) ? 5 : 0
    harvesterMaxLevel += data.legendaryResearch[3].gte(legendaryResearches[3].max) ? 5 : 0
    harvesterMaxLevel += data.legendaryResearch[4].gte(legendaryResearches[4].max) ? 5 : 0
    harvesterMaxLevel += data.legendaryResearch[5].gte(legendaryResearches[5].max) ? 5 : 0

    for(let i = 0; i < data.harvesters.length; i++) {
        harvesterUpgradeCosts[i] = D(1e3).times(Decimal.pow(1.65,data.harvesters[i].level))
        runHarvester(i)
    }
        
}

function ascend() {
    if(data.money.lt(1e45) || data.currentEgg !== 18) return
    data.hasAscended = true
    data.stats.ascensions[2] = data.stats.ascensions[1]
    data.stats.ascensions[1] = data.stats.ascensions[0]
    data.stats.ascensions[0] = knowleggGain
    data.stats.timeInAscension = data.stats.timeInPrestige = Decimal.dZero
    if(data.prophecyEggs.eq(0) && !data.achievements[49])
        getAchievement(49)
    data.knowlegg = data.knowlegg.add(knowleggGain)
    if(data.knowlegg.gt(data.bestKnowlegg)) data.bestKnowlegg = data.stats.bestKnowleggs = data.knowlegg
    data.soulEggs = Decimal.dZero
    data.bestSoulEggs = Decimal.dZero
    data.prophecyEggs = Decimal.dZero
    for(let i = 0; i < 6; i++) {
        if(i !== 2)
        data.planetData[i] = {money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)}
    }
    data.research = new Array(28).fill(Decimal.dZero)
    for(let i = 0; i < 6; i++)
        data.epicResearch[i] = Decimal.dZero
    eggValueBonus = Decimal.dOne
    chickenGain = Decimal.dZero
    layRate = Decimal.dOne
    data.chickens = Decimal.dZero
    data.money = Decimal.dZero
    data.bestRunMoney = Decimal.dZero
    data.currentEgg = 0
    updateResearch()
    updateEggValueBonus()
    updateIntHatch()
    updateLayRate()
    updatePrestige()
    for(let i = 0; i < 3; i++)
        generateContract(i)
}

function updateAscensionHoverText(id,type) {
    artifactHoverIndex.id = id
    artifactHoverIndex.type = type
    const selectedEls = document.getElementsByClassName('artifactSlot-selected')

    for(let i = 0; i < selectedEls.length; i++)
        selectedEls[i].classList = 'artifactSlot'
    
    

    switch(type) {
        case 'artifact':
            DOMCacheGetOrSet(`artifactSlot${id}`).classList = 'artifactSlot-selected'
            if(id < 4)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Egg Value: x${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            else if(id >= 4 && id < 8)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Enlightenment Egg Value: x${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            else if(id >= 8 && id < 12)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Prophecy Egg Bonus: x${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            else if(id >= 12 && id < 16)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Soul Egg Bonus: x${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            else if(id >= 16 && id < 20)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Chicken Gain: x${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            else if(id >= 20 && id < 24)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedArtifact[id] ? 'Not Discovered Yet' : `${artifacts[id].name} | Research Cost: /${toPlaces(artifacts[id].effect.add(Decimal.dOne),4,(artifacts[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.artifacts[id],0,data.artifacts[id].add(Decimal.dOne))}`
            break
        case 'gem':
            DOMCacheGetOrSet(`gemSlot${id}`).classList = 'artifactSlot-selected'
            if(id < 3)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Host Effect on Enlightenment Egg: ${toPlaces(gems[id].effect.times(100),4,(gems[id].effect.times(100)).add(Decimal.dOne))}%\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}`
            else if(id >= 3 && id < 6)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Chicken Gain: x${toPlaces(gems[id].effect.add(Decimal.dOne),4,(gems[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}`
            else if(id >= 6 && id < 9)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Egg Value: x${toPlaces(gems[id].effect.add(Decimal.dOne),4,(gems[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}` 
            else if(id >= 9 && id < 12)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Egg Laying Rate: x${toPlaces(gems[id].effect.add(Decimal.dOne),4,(gems[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}`
            else if(id >= 12 && id < 15)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Soul Egg Bonus: x${toPlaces(gems[id].effect.add(Decimal.dOne),4,(gems[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}`
            else if(id >= 15 && id < 18)
                DOMCacheGetOrSet('artifactHoverText').innerText = !data.unlockedGem[id] ? 'Not Discovered Yet' : `${gems[id].name} | Prophecy Egg Bonus: x${toPlaces(gems[id].effect.add(Decimal.dOne),4,(gems[id].effect).add(Decimal.dTwo))}\n You have: ${toPlaces(data.gems[id],0,data.gems[id].add(Decimal.dOne))}`

            break
        default:
            console.error('Invalid Type Used')
            break
    }
}

function updateHarvesterHoverText(id) {
    harvesterHoverIndex = id

    const selectedEls = document.getElementsByClassName('harvesterImg-selected')

    for(let i = 0; i < selectedEls.length; i++)
        selectedEls[i].classList = 'harvesterImg-inactive'

    DOMCacheGetOrSet(`harvesterImg${id}`).classList = 'harvesterImg-selected'
   
    if(harvesterHoverIndex === -1)     
        DOMCacheGetOrSet('harvesterHoverText').innerText = 'Hover over Harvester to see info'
    else 
        DOMCacheGetOrSet('harvesterHoverText').innerText = data.harvesters[id].level === 0 ? `Harvester Construction Cost: ${format(harvesterUpgradeCosts[id])} ${planetEggNames[id]} Chickens` :
        `${planetNames[id]} Harvester | Level: ${data.harvesters[id].level}/${harvesterMaxLevel}\n${getHarvesterYieldString(id)}\n${data.harvesters[id].level < harvesterMaxLevel ? `Upgrade to Level ${data.harvesters[id].level+1}: ${format(harvesterUpgradeCosts[id])} ${planetEggNames[id]} Chickens` : ''}`
       
}

function activateArtifactSelect(slotID) {
    if(selectingArtifactGem.status && selectingArtifactGem.type === 'artifact' && selectingArtifactGem.slotID === slotID) {
        selectingArtifactGem.status = false
        selectingArtifactGem.type = null
        selectingArtifactGem.slotID = -1
        DOMCacheGetOrSet('artifactSelectionText').innerText = 'Click on an Artifact or Gem Slot above to begin Selection'
        return
    }
    if(selectingArtifactGem.status) return
    selectingArtifactGem.status = true
    selectingArtifactGem.type = 'artifact'
    selectingArtifactGem.slotID = slotID
    DOMCacheGetOrSet('artifactSelectionText').innerText = `Click on an Artifact to Insert or Click on the slot to Cancel`
}

function activateGemSelect(slotID) {
    if(selectingArtifactGem.status && selectingArtifactGem.type === 'gem' && selectingArtifactGem.slotID === slotID) {
        selectingArtifactGem.status = false
        selectingArtifactGem.type = null
        selectingArtifactGem.slotID = -1
        DOMCacheGetOrSet('artifactSelectionText').innerText = 'Click on an Artifact or Gem Slot above to begin Selection'
        return
    }
    if(selectingArtifactGem.status) return
    if(!gemSlotAvailable(slotID)) return
    selectingArtifactGem.status = true
    selectingArtifactGem.type = 'gem'
    selectingArtifactGem.slotID = slotID
    DOMCacheGetOrSet('artifactSelectionText').innerText = `Click on a Gem to Insert or Click on the slot to Cancel`
}

function selectArtifact(artifactID) {
    if(!selectingArtifactGem.status || selectingArtifactGem.type !== 'artifact') return
    if(data.artifacts[artifactID].lte(0) || !data.unlockedArtifact[artifactID]) return
    if(artifactAlreadyActive(artifactID)) {
        generateNotification('Artifact is already active','error')
        return
    }
    if(data.activeArtifacts[selectingArtifactGem.slotID] != -1) {
        data.artifacts[data.activeArtifacts[selectingArtifactGem.slotID]] = data.artifacts[data.activeArtifacts[selectingArtifactGem.slotID]].add(Decimal.dOne)
    }
    data.activeArtifacts[selectingArtifactGem.slotID] = artifactID
    for(let i = 0; i < 3; i++) {
        if(!gemSlotAvailable(i+(selectingArtifactGem.slotID*3)) && data.activeGems[i+(selectingArtifactGem.slotID*3)] !== -1)
            data.gems[data.activeGems[i+(selectingArtifactGem.slotID*3)]] = data.gems[data.activeGems[i+(selectingArtifactGem.slotID*3)]].add(Decimal.dOne)
            data.activeGems[i+(selectingArtifactGem.slotID*3)] = -1;
    }
    selectingArtifactGem.status = false
    selectingArtifactGem.type = null
    selectingArtifactGem.slotID = -1
    data.artifacts[artifactID] = data.artifacts[artifactID].sub(Decimal.dOne)
}

function selectGem(gemID) {
    if(!selectingArtifactGem.status || selectingArtifactGem.type !== 'gem') return
    if(!data.unlockedGem[gemID] || data.gems[gemID].lte(0)) return
    if(data.activeGems[selectingArtifactGem.slotID] != -1) {
        data.gems[data.activeGems[selectingArtifactGem.slotID]] = data.gems[data.activeGems[selectingArtifactGem.slotID]].add(Decimal.dOne)
    }
    data.activeGems[selectingArtifactGem.slotID] = gemID
    selectingArtifactGem.status = false
    selectingArtifactGem.type = null
    selectingArtifactGem.slotID = -1
    data.gems[gemID] = data.gems[gemID].sub(Decimal.dOne)
}

function gemSlotAvailable(slotID) {
    const artifactSlotID = Math.floor(slotID/3)
    const artifactID = data.activeArtifacts[artifactSlotID]
    const artifactTier = calculateArtifactTier(artifactID)
    const slotTier = (slotID % 3) + 1

    return (artifactTier - 1) >= slotTier;
}

function calculateArtifactTier(artifactID) {
    const tier2Base = 1;
    const tier3Base = 2;
    const tier4Base = 3;

    const gemSlotIncrement = 4;

    if (artifactID % gemSlotIncrement === tier2Base) {
        return 2;
    } else if (artifactID % gemSlotIncrement === tier3Base) {
        return 3;
    } else if (artifactID % gemSlotIncrement === tier4Base) {
        return 4;
    } else {
        return 1; // Default to tier 1 if none of the conditions match
    }
}

function calculateCollectionBonus() {
    let bonus = D(1)
    for(let i = 0; i < data.artifacts.length; i++) {
        switch(i % 4) {
            case 0:
                bonus = bonus.add(D(0.025).times(data.artifacts[i]))
                break
            case 1:
                bonus = bonus.add(D(0.05).times(data.artifacts[i]))
                break
            case 2:
                bonus = bonus.add(D(0.125).times(data.artifacts[i]))
                break
            case 3:
                bonus = bonus.add(D(0.25).times(data.artifacts[i]))
                break
        }
    }
    return bonus
}

function artifactAlreadyActive(artifactID) {
    for(let i = 0; i < data.activeArtifacts.length; i++) {
        if(data.activeArtifacts[i] === artifactID) return true;
    }
    return false;
}

function generateArtifactCraftingInfo(artifactID,type) {
    let str
    if((type === 'artifact' && data.unlockedArtifact[artifactID]) || (type === 'gem' && data.unlockedGem[artifactID]))
        str = `${type === 'artifact' ? artifacts[artifactID].name : gems[artifactID].name}\n`
    else {
        return `${type === 'artifact' ? 'Artifact' : 'Gem'} not unlocked :(`
    }
    
    if(type === 'artifact' && artifacts[artifactID].crafting.length === 0) return str + 'Item Not Craftable'
    if(type === 'gem' && gems[artifactID].crafting.length === 0) return str + 'Item Not Craftable'

    switch(type) {
        case 'artifact':
                let artifactCraftArr = artifacts[artifactID].crafting
                for(let i = 0; i < artifactCraftArr.length; i++) {
                    if(artifactCraftArr[i].type === 'artifact') {
                        str += `${artifacts[artifactCraftArr[i].id].name}: x${toPlaces(artifactCraftArr[i].count,0,artifactCraftArr[i].count.add(Decimal.dOne))} (${toPlaces(data.artifacts[artifactCraftArr[i].id],0,data.artifacts[artifactCraftArr[i].id].add(Decimal.dOne))})\n`
                    }
                    else {
                        str += `${gems[artifactCraftArr[i].id].name}: x${toPlaces(artifactCraftArr[i].count,0,artifactCraftArr[i].count.add(Decimal.dOne))} (${toPlaces(data.gems[artifactCraftArr[i].id],0,data.gems[artifactCraftArr[i].id].add(Decimal.dOne))})\n`
                    }
                }
            break
        case 'gem':
            let gemCraftArr = gems[artifactID].crafting
            for(let i = 0; i < gemCraftArr.length; i++) {
                    str += `${gems[gemCraftArr[i].id].name}: x${toPlaces(gemCraftArr[i].count,0,gemCraftArr[i].count.add(Decimal.dOne))} (${toPlaces(data.gems[gemCraftArr[i].id],0,data.gems[gemCraftArr[i].id].add(Decimal.dOne))})\n`
            }
            break
        default:
            console.error('Invalid Input in generateArtifactCraftingInfo()')
            return null
    }
    return str
}

function canCraftArtifact(artifactID,type) {
    if(artifactID === -1 || type === null) return false
    if(type !== 'artifact' && type !== 'gem') {console.error('Invalid Type in canCraftArtifact()'); return false}
    if((type === 'artifact' && !data.unlockedArtifact[artifactID]) || (type === 'gem' && !data.unlockedGem[artifactID])) return false

    const craftingArr = type === 'artifact' ? artifacts[artifactID].crafting : gems[artifactID].crafting
    if(craftingArr.length === 0) return false

    for(let i = 0; i < craftingArr.length; i++) {
        if(craftingArr[i].type === 'artifact') {
            if(data.artifacts[craftingArr[i].id].lt(craftingArr[i].count)) return false
        }
        else {
            if(data.gems[craftingArr[i].id].lt(craftingArr[i].count)) return false
        }
    }

    return true
}

function craftArtifact() {
    if(!canCraftArtifact(artifactHoverIndex.id,artifactHoverIndex.type)) return

    const craftingArr = artifactHoverIndex.type === 'artifact' ? artifacts[artifactHoverIndex.id].crafting : gems[artifactHoverIndex.id].crafting
    for(let i = 0; i < craftingArr.length; i++) {
        if(craftingArr[i].type === 'artifact') {
            data.artifacts[craftingArr[i].id] = data.artifacts[craftingArr[i].id].sub(craftingArr[i].count)
        }
        else {
            data.gems[craftingArr[i].id] = data.gems[craftingArr[i].id].sub(craftingArr[i].count)
        }
    }

    if(artifactHoverIndex.type === 'artifact') {
        data.artifacts[artifactHoverIndex.id] = data.artifacts[artifactHoverIndex.id].add(Decimal.dOne)
    }
    else {
        data.gems[artifactHoverIndex.id] = data.gems[artifactHoverIndex.id].add(Decimal.dOne)
    }
    updateAscensionHoverText(artifactHoverIndex.id,artifactHoverIndex.type)
}

function startHarvester(id) {
    if(data.harvesters[id].timeRemaining > 0 && data.harvesters[id].level > 0) return
    data.harvesters[id].timeRemaining = 5 * data.harvesters[id].level
    data.harvesters[id].running = true
}

function runHarvester(id) {
    if(data.harvesters[id].running && data.harvesters[id].timeRemaining <= 0) {
        if(data.settingsToggles[6])
            generateNotification(`${planetNames[id]} Harvester Finished!`,'success')
        const harvesterYield = calculateHarvesterYield(id)
        data.harvesters[id].running = false
        data.harvesters[id].timeRemaining = 0

        for(let i = 0; i < harvesterYield.artifacts.length; i++) {
            data.artifacts[harvesterYield.artifacts[i].id] = data.artifacts[harvesterYield.artifacts[i].id].add(getRandom(harvesterYield.artifacts[i].lower,harvesterYield.artifacts[i].upper+1))
        }
        
        for(let i = 0; i < harvesterYield.gems.length; i++) {
            data.gems[harvesterYield.gems[i].id] = data.gems[harvesterYield.gems[i].id].add(getRandom(harvesterYield.gems[i].lower,harvesterYield.gems[i].upper+1))
        }

        for(let i = 0; i < data.unlockedArtifact.length; i++) {
            if(data.artifacts[i].gte(Decimal.dOne) && !data.unlockedArtifact[i])
                data.unlockedArtifact[i] = true
        }
    
        for(let i = 0; i < data.unlockedGem.length; i++) {
            if(data.gems[i].gte(Decimal.dOne) && !data.unlockedGem[i])
                data.unlockedGem[i] = true
        }
    }
    else if(data.harvesters[id].running && data.harvesters[id].timeRemaining > 0) {
        data.harvesters[id].timeRemaining -= diff
    }
}

function upgradeHarvester() {
    updateAscension()
    const id = harvesterHoverIndex // To prevent somehow changing the id while upgrading
    if(id === -1) return
    if(data.harvesters[id].level >= 20 || data.harvesters[id].level >= harvesterMaxLevel) return
    if(data.planetData[id].chickens.sub(harvesterUpgradeCosts[id]).lt(Decimal.dZero)) return
    data.planetData[id].chickens = data.planetData[id].chickens.sub(harvesterUpgradeCosts[id])
    data.harvesters[id].level++
    updateAscension()
    updateHarvesterHoverText(id)
}

function getHarvesterYieldString(id) {
    const harvesterInterval = Math.floor((data.harvesters[id].level - 1) / 5)
    const harvesterYieldObj = calculateHarvesterYield(id)
    switch(harvesterInterval) {
        case 0:
            return `-=Harvestable Artifacts=-\n${artifacts[harvesterYieldObj.artifacts[0].id].name} | Yield: ${harvesterYieldObj.artifacts[0].lower} - ${harvesterYieldObj.artifacts[0].upper}`
        case 1:
            return `-=Harvestable Artifacts=-\n${artifacts[harvesterYieldObj.artifacts[0].id].name} | Yield: ${harvesterYieldObj.artifacts[0].lower} - ${harvesterYieldObj.artifacts[0].upper}\n${artifacts[harvesterYieldObj.artifacts[1].id].name} | Yield: ${harvesterYieldObj.artifacts[1].lower} - ${harvesterYieldObj.artifacts[1].upper }` +
            `\n-=Harvestable Gems=-\n${gems[harvesterYieldObj.gems[0].id].name} | Yield: ${harvesterYieldObj.gems[0].lower} - ${harvesterYieldObj.gems[0].upper}`
        case 2:
            return `-=Harvestable Artifacts=-\n${artifacts[harvesterYieldObj.artifacts[0].id].name} | Yield: ${harvesterYieldObj.artifacts[0].lower} - ${harvesterYieldObj.artifacts[0].upper}\n${artifacts[harvesterYieldObj.artifacts[1].id].name} | Yield: ${harvesterYieldObj.artifacts[1].lower} - ${harvesterYieldObj.artifacts[1].upper }\n${artifacts[harvesterYieldObj.artifacts[2].id].name} | Yield: ${harvesterYieldObj.artifacts[2].lower} - ${harvesterYieldObj.artifacts[2].upper}` +
            `\n-=Harvestable Gems=-\n${gems[harvesterYieldObj.gems[0].id].name} | Yield: ${harvesterYieldObj.gems[0].lower} - ${harvesterYieldObj.gems[0].upper}\n${gems[harvesterYieldObj.gems[1].id].name} | Yield: ${harvesterYieldObj.gems[1].lower} - ${harvesterYieldObj.gems[1].upper}`
        case 3:
            return `-=Harvestable Artifacts=-\n${artifacts[harvesterYieldObj.artifacts[0].id].name} | Yield: ${harvesterYieldObj.artifacts[0].lower} - ${harvesterYieldObj.artifacts[0].upper}\n${artifacts[harvesterYieldObj.artifacts[1].id].name} | Yield: ${harvesterYieldObj.artifacts[1].lower} - ${harvesterYieldObj.artifacts[1].upper}\n${artifacts[harvesterYieldObj.artifacts[2].id].name} | Yield: ${harvesterYieldObj.artifacts[2].lower} - ${harvesterYieldObj.artifacts[2].upper}\n${artifacts[harvesterYieldObj.artifacts[3].id].name} | Yield: ${harvesterYieldObj.artifacts[3].lower} - ${harvesterYieldObj.artifacts[3].upper}` +
            `\n-=Harvestable Gems=-\n${gems[harvesterYieldObj.gems[0].id].name} | Yield: ${harvesterYieldObj.gems[0].lower} - ${harvesterYieldObj.gems[0].upper}\n${gems[harvesterYieldObj.gems[1].id].name} | Yield: ${harvesterYieldObj.gems[1].lower} - ${harvesterYieldObj.gems[1].upper}\n${gems[harvesterYieldObj.gems[2].id].name} | Yield: ${harvesterYieldObj.gems[2].lower} - ${harvesterYieldObj.gems[2].upper}`
        default:
            return 'Error in Yield String'
    }
}

function calculateHarvesterYield(id) {
    if(data.harvesters[id].level === 0) return undefined
    const harvesterInterval = Math.floor((data.harvesters[id].level - 1) / 5)
    let yieldObj = {
        artifacts: [],
        gems: []
    }

    for(let i = 0; i <= harvesterInterval; i++) {
        yieldObj.artifacts.push({id: ((id * 4) + i),lower: ((harvesterInterval - i) * 5), upper: (data.harvesters[id].level - (5 * i))})
    }

    for(let i = 0; i <= harvesterInterval - 1; i++) {
        yieldObj.gems.push({id: ((id * 3) + i),lower: (Math.floor( (data.harvesters[id].level - (5 * (i))) / 3)) - 2, upper: ((harvesterInterval - (i)) * 3)})
        if(i === 3)
            yieldObj.gems[2].lower -= 2
    }

    return yieldObj
}

function selectLoadout(id) {
    selectedLoadout = id;
    for(let i = 0; i < data.artifactLoadouts.length; i++) {
        DOMCacheGetOrSet(`artifactLoadoutButton${i}`).classList = i === id ? 'orangeButton-active' : 'orangeButton'
    }
}

function loadLoadout() {
    if(selectedLoadout === -1) {
        generateNotification('No Loadout Selected','error')
        return
    }
    const loadout = data.artifactLoadouts[selectedLoadout]
    data.currentLoadout = selectedLoadout
    for(let i = 0; i < loadout.artifactIDs.length; i++) {
        data.activeArtifacts[i] = loadout.artifactIDs[i]
    }
    for(let i = 0; i < loadout.gemIDs.length; i++) {
        data.activeGems[i] = loadout.gemIDs[i]
    }
    DOMCacheGetOrSet(`artifactLoadoutButton${selectedLoadout}`).classList = 'orangeButton'
    selectedLoadout = -1
}

function saveLoadout() {
    if(selectedLoadout === -1) {
        generateNotification('No Loadout Selected','error')
        return
    }
    for(let i = 0; i < data.artifactLoadouts[selectedLoadout].artifactIDs.length; i++) {
        data.artifactLoadouts[selectedLoadout].artifactIDs[i] = data.activeArtifacts[i]
    }
    for(let i = 0; i < data.artifactLoadouts[selectedLoadout].gemIDs.length; i++) {
        data.artifactLoadouts[selectedLoadout].gemIDs[i] = data.activeGems[i]
    }
    DOMCacheGetOrSet(`artifactLoadoutButton${selectedLoadout}`).classList = 'orangeButton'
    selectedLoadout = -1
}

function getActiveArtifactBoost(groupID) {
    let boostSum = Decimal.dOne
    let currentArtifactBoost = Decimal.dZero
    for(let i = 0; i < data.activeArtifacts.length; i++) {
        if(data.activeArtifacts[i] !== -1 && Math.floor(data.activeArtifacts[i] / 4) === groupID) { // Valid Artifact?
            if((data.currentEgg !== 18 && data.currentPlanetIndex !== 2 && groupID !== 1)) { // Not Enlightenment, Xylok & Artifact is not Scroll
                currentArtifactBoost = artifacts[data.activeArtifacts[i]].effect
            }

            if((data.currentEgg === 18 || data.currentPlanetIndex === 2) && groupID === 1) { // Scroll Boost Logic
                currentArtifactBoost = artifacts[data.activeArtifacts[i]].effect
            }

            if((data.currentEgg === 18 || data.currentPlanetIndex === 2)) { // Knowledge Gem Logic
                if(Math.floor(data.activeGems[(i * 3)] / 3) === 0) {
                    currentArtifactBoost = currentArtifactBoost.add(artifacts[data.activeArtifacts[i]].effect.times(gems[data.activeGems[(i * 3)]].effect))
                }
                if(Math.floor(data.activeGems[(i * 3) + 1] / 3) === 0) {
                    currentArtifactBoost = currentArtifactBoost.add(artifacts[data.activeArtifacts[i]].effect.times(gems[data.activeGems[(i * 3) + 1]].effect))
                }
                if(Math.floor(data.activeGems[(i * 3) + 2] / 3) === 0) {
                    currentArtifactBoost = currentArtifactBoost.add(artifacts[data.activeArtifacts[i]].effect.times(gems[data.activeGems[(i * 3) + 2]].effect))
                }
            }
            boostSum = boostSum.add(currentArtifactBoost)
        }
    }
    return boostSum.times(collectionBoost)
}

function getActiveGemBoost(groupID) {
    let boostSum = Decimal.dOne 
    for(let i = 0; i < data.activeGems.length; i++) {
        if(data.activeGems[i] !== -1 && Math.floor(data.activeGems[i] / 3) === groupID) {
            if(data.currentEgg !== 18 || ((data.currentEgg === 18 || data.currentPlanetIndex === 2) && Math.floor(data.activeArtifacts[Math.floor(i / 3)] / 4) === 1)) {
                boostSum = boostSum.add(gems[data.activeGems[i]].effect)
            }
        }
    }  
    return boostSum 
}
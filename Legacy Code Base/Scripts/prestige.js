let soulEggGain = Decimal.dZero
let soulEggBoost = Decimal.dZero
let prophecyEggBoost = Decimal.dZero
let contractRewardBoost = Decimal.dOne
let contractGoalBoost = Decimal.dOne
let softCapAmts = [Decimal.dZero,Decimal.dZero]
function updatePrestige() {
    if(data.bestSoulEggs.lt(data.soulEggs)) data.bestSoulEggs = data.soulEggs
    const soulAvg = (data.soulEggs.add(data.bestSoulEggs)).div(2)
    soulEggGain = data.currentEgg >= 3 ? Decimal.floor(Decimal.sqrt(Decimal.sqrt(data.bestRunMoney)).times((D(0.1).times(data.epicResearch[3])).add(Decimal.dOne))) : Decimal.dZero
    soulEggGain = soulEggGain.times(planetBoosts[3])
    prophecyEggBoost = Decimal.pow(1.015, data.prophecyEggs)
    //console.log(formatSci(prophecyEggBoost))
    softCapAmts[1] = prophecyEggBoost
    if(prophecyEggBoost.gte(1e6)) prophecyEggBoost = prophecyEggBoost.div(1e6).log10().add(Decimal.dOne).mul(1e6)
    softCapAmts[1] = softCapAmts[1].div(prophecyEggBoost)
    prophecyEggBoost = prophecyEggBoost.times(getActiveArtifactBoost(2))
    prophecyEggBoost = prophecyEggBoost.times(getActiveGemBoost(5))
    //console.log(formatSci(prophecyEggBoost))
    
    soulEggBoost = Decimal.dOne.add(soulAvg.times(D(0.01).add(D(0.01).times(data.epicResearch[2]))).times(prophecyEggBoost))
    soulEggBoost = soulEggBoost.times(getActiveArtifactBoost(3))
    soulEggBoost = soulEggBoost.times(getActiveGemBoost(4))
    contractRewardBoost = Decimal.dOne.add(Decimal.sqrt(data.prophecyEggs.times(D(0.45))))
    contractGoalBoost = Decimal.dOne.add(Decimal.sqrt(data.prophecyEggs.times(D(0.5))))
    if((data.onPlanet === true && data.currentPlanetIndex === 3)) {
        soulEggBoost = Decimal.dOne
        prophecyEggBoost = Decimal.dOne
        contractRewardBoost = Decimal.dOne
    }
}

function prestige() {
    if(data.currentEgg < 3 || contractActive()) return
    data.stats.prestiges[2] = data.stats.prestiges[1]
    data.stats.prestiges[1] = data.stats.prestiges[0]
    data.stats.prestiges[0] = soulEggGain
    if(data.prophecyEggs.eq(0) && !data.achievements[48])
        getAchievement(48)
    data.stats.timeInPrestige = Decimal.dZero
    data.soulEggs = data.soulEggs.add(soulEggGain)
    data.hasPrestiged = true
    data.research = new Array(28).fill(Decimal.dZero)
    eggValueBonus = Decimal.dOne
    chickenGain = Decimal.dZero
    layRate = Decimal.dOne
    data.chickens = Decimal.dZero
    data.money = Decimal.dZero
    data.bestRunMoney = Decimal.dZero
    data.currentEgg = 0
}
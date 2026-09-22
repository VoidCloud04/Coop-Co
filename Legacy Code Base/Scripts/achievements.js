const achievementObjs = [
    { name: 'Eggcellent', description: 'Start Playing!', img: `${eggImgPath}${eggData[0].id}.png`},
    { name: 'Superegg', description: 'Unlock the 2nd Egg', img: `${eggImgPath}${eggData[1].id}.png`},
    { name: 'Meggdical', description: 'Unlock the 3rd Egg', img: `${eggImgPath}${eggData[2].id}.png`},
    { name: 'Rockegg Fuel', description: 'Unlock the 4th Egg', img: `${eggImgPath}${eggData[3].id}.png`},
    { name: 'Uber Material', description: 'Unlock the 5th Egg', img: `${eggImgPath}${eggData[4].id}.png`},
    { name: 'Fused', description: 'Unlock the 6th Egg', img: `${eggImgPath}${eggData[5].id}.png`},
    { name: 'Quantum Flux', description: 'Unlock the 7th Egg', img: `${eggImgPath}${eggData[6].id}.png`},
    { name: 'Fountain of Youth', description: 'Unlock the 8th Egg', img: `${eggImgPath}${eggData[7].id}.png`},
    { name: 'Time and Space', description: 'Unlock the 9th Egg', img: `${eggImgPath}${eggData[8].id}.png`},
    { name: 'Gravity Well', description: 'Unlock the 10th Egg', img: `${eggImgPath}${eggData[9].id}.png`},
    { name: 'Diliuted', description: 'Unlock the 11th Egg', img: `${eggImgPath}${eggData[10].id}.png`},
    { name: 'Prodigy Child', description: 'Unlock the 12th Egg', img: `${eggImgPath}${eggData[11].id}.png`},
    { name: 'Terraforming Mars', description: 'Unlock the 13th Egg', img: `${eggImgPath}${eggData[12].id}.png`},
    { name: 'Anti Anti Matter', description: 'Unlock the 14th Egg', img: `${eggImgPath}${eggData[13].id}.png`},
    { name: 'Moar Matter', description: 'Unlock the 15th Egg', img: `${eggImgPath}${eggData[14].id}.png` },
    { name: 'AEgg', description: 'Unlock the 16th Egg', img: `${eggImgPath}${eggData[15].id}.png`},
    { name: 'Nebulous', description: 'Unlock the 17th Egg', img: `${eggImgPath}${eggData[16].id}.png`},
    { name: 'Universal Problem', description: 'Unlock the 18th Egg', img: `${eggImgPath}${eggData[17].id}.png`},
    { name: 'Egglightenment', description: 'Unlock the 19th Egg', img: `${eggImgPath}${eggData[18].id}.png`},
    { name: 'Contracted', description: 'Completed a Contract', img: 'Images/greencheck.png'},
    { name: 'Contractual', description: 'Complete 10 Contracts', img: 'Images/greencheck.png'},
    { name: 'Contractful', description: 'Complete 100 Contracts', img: 'Images/greencheck.png'},
    { name: 'Contractor', description: 'Complete 250 Contracts', img: 'Images/greencheck.png'},
    { name: 'You got a Soul', description: 'Get 1 Thousand Soul Eggs', img: `${eggImgPath}soul.png`},
    { name: 'Quite a few Souls', description: 'Get 1 Million Soul Eggs', img: `${eggImgPath}soul.png`},
    { name: 'Lotta Souls', description: 'Get 1 Billion Soul Eggs', img: `${eggImgPath}soul.png`},
    { name: 'No More Souls Please', description: 'Get 1 Trillion Soul Eggs', img: `${eggImgPath}soul.png`},
    { name: 'Elijah', description: 'Get 10 Prophecy Eggs', img: `${eggImgPath}prophecy.png`},
    { name: 'Elisha', description: 'Get 100 Prophecy Eggs', img: `${eggImgPath}prophecy.png`},
    { name: 'Daniel', description: 'Get 1 Thousand Prophecy Eggs', img: `${eggImgPath}prophecy.png`},
    { name: 'Isaiah', description: 'Get 10 Thousand Prophecy Eggs', img: `${eggImgPath}prophecy.png`},
    { name: 'Energy Too', description: 'Discover Arcturus', img: `Images/planet1.png`},
    { name: 'Outta Time', description: 'Discover Ravnar', img: `Images/planet2.png`},
    { name: 'At last. Peace', description: 'Discover Xylok', img: `Images/planet3.png`},
    { name: 'The Void', description: 'Discover Triton', img: `Images/planet4.png`},
    { name: 'Great Balls of Fire!', description: 'Discover Hereth', img: `Images/planet5.png`},
    { name: 'Aaaaa Light Mode', description: 'Discover Malak', img: `Images/planet6.png`},
    { name: 'Ascendance', description: 'Obtain 1 Knowlegg', img: `${eggImgPath}knowlegg.png`},
    { name: 'Knowledge is the Key', description: 'Obtain 10 Knowleggs', img: `${eggImgPath}knowlegg.png`},
    { name: 'Lightbulb...', description: 'Obtain 25 Knowleggs', img: `${eggImgPath}knowlegg.png`},
    { name: 'Library of Alexandria', description: 'Obtain 50 Knowleggs', img: `${eggImgPath}knowlegg.png`},
    { name: 'Dusty Garbage', description: 'Acquire your first Tier I Artifact', img: 'Images/Fragmented.png'},
    { name: 'Restoration Expert', description: 'Acquire your first Tier II Artifact', img: 'Images/Restored.png'},
    { name: 'Master Reforger', description: 'Acquire your first Tier III Artifact', img: 'Images/Upgraded.png'},
    { name: 'Ultimate Craftsman', description: 'Acquire your first Tier IV Artifact', img: 'Images/Gilded.png'},
    { name: 'Scrounger', description: 'Acquire a Gem Fragment', img: 'Images/Gems/Knowledge-Fragment.png'},
    { name: 'Gemsmith', description: 'Acquire a Gem Shard', img: 'Images/Gems/Soul-Shard.png'},
    { name: 'Gemologist', description: 'Acquire a Gemstone', img: 'Images/Gems/Ascension-Gem.png'},
    { name: 'Anti-Prophecy Club', description: 'Prestige with No Prophecy Eggs', img: 'Images/Achievements/Anti1.png'},
    { name: 'Anti-Anti-Anti-Prophecy Club', description: 'Ascend with No Prophecy Eggs', img: 'Images/Achievements/Anti2.png'},
    { name: 'Hoarder', description: 'Get your Artifact Collection Bonus to 100x', img: 'Images/Achievements/Hoarder.png'},
    { name: 'Extraction Specialist', description: 'Get all Harvesters to Level 20', img:'Images/Achievements/Extractor.png'},
    { name: 'The Collector', description: 'Collect All of the Max Tier Gems & Artifacts', img: 'Images/Achievements/Collector.png'}
]

const achievementDisplayArr = new Array(achievementObjs.length+3).fill('blank')
for(let i = 0; i < 19; i++)
    achievementDisplayArr[i] = 'ach'

for(let i = 20; i < 38; i++)
    achievementDisplayArr[i] = 'ach'

for(let i = 40; i < 56; i++)
    achievementDisplayArr[i] = 'ach'


function updateAchText(i) {
    if(i < 19)
        DOMCacheGetOrSet('achHoverText').innerText = `[${i+1}] - ${!data.achievements[i] ? '???' :achievementObjs[i].name}\n${achievementObjs[i].description}`
    else if(i >= 31 && i <= 36)
        DOMCacheGetOrSet('achHoverText').innerText = `[${i+1}] - ${!data.achievements[i] ? '???' : achievementObjs[i].name}\n${!data.achievements[i] ? '???' : achievementObjs[i].description}`
    else
        DOMCacheGetOrSet('achHoverText').innerText = `[${i+1}] - ${achievementObjs[i].name}\n${achievementObjs[i].description}`
    DOMCacheGetOrSet('achHoverText').style.color = data.achievements[i] ? 'var(--green)' : 'var(--red)'
}

function getAchievement(i) {
    if(data.achievements[i] === true) return
    data.achievements[i] = true
    generateNotification(`${achievementObjs[i].name} Unlocked!`,'success')
    updateAchClass()
}

function getAchievementsCompleted() {
    let count = 0;
    for(let i = 0; i < data.achievements.length; i++) {
        if(data.achievements[i] === true) count++
    }
    return count
}
const contractCompleteReq = [Decimal.dOne,Decimal.dTen,D(100),D(250)]
const soulAchReq = [D(1e3),D(1e6),D(1e9),D(1e12)]
const prophecyAchReq = [Decimal.dTen,D(100),D(1e3),D(1e4)]
const knowleggAchReq = [Decimal.dOne,Decimal.dTen,D(25),D(50)]
function checkAchievements() {
    //Eggs
    if(data.achievements[0] === false) data.achievements[0] = true;
    for(let i = 1; i < 19; i++) {
        if(data.unlockedEgg[i-1] === true && data.achievements[i] === false) getAchievement(i)
    }
    //Soul and Prophecy
    
    for(let i = 19; i < 23; i++) {
        if(data.stats.contractsComplete.gte(contractCompleteReq[i-19]) && data.achievements[i] === false) getAchievement(i)
    }
    
    for(let i = 23; i < 27; i++)
        if(data.soulEggs.gte(soulAchReq[i-23]) && data.achievements[i] === false) getAchievement(i)
    
    for(let i = 27; i < 31; i++)
        if(data.prophecyEggs.gte(prophecyAchReq[i-27]) && data.achievements[i] === false) getAchievement(i)
    //Planets and Knowledge
    for(let i = 31; i < 37; i++)
        if(data.planetsDiscovered[i-31] === true && data.achievements[i] === false) getAchievement(i)
    for(let i = 37; i < 41; i++)
        if(data.bestKnowlegg.gte(knowleggAchReq[i-37]) && !data.achievements[i]) getAchievement(i)
    // Artifact Achievements
    if(!data.achievements[41]) {
        for(let i = 0; i < 6; i++) {
            if(data.artifacts[i * 4].gte(Decimal.dOne)) {
                getAchievement(41)
                break
            }
        }
    }
    if(!data.achievements[42]) {
        for(let i = 0; i < 6; i++) {
            if(data.artifacts[(i * 4)+1].gte(Decimal.dOne)) {
                getAchievement(42)
                break
            }
        }
    }
    if(!data.achievements[43]) {
        for(let i = 0; i < 6; i++) {
            if(data.artifacts[(i * 4)+2].gte(Decimal.dOne)) {
                getAchievement(43)
                break
            }
        }
    }
    if(!data.achievements[44]) {
        for(let i = 0; i < 6; i++) {
            if(data.artifacts[(i * 4)+3].gte(Decimal.dOne)) {
                getAchievement(44)
                break
            }
        }
    }
    // Gem Achievements
    if(!data.achievements[45]) {
        for(let i = 0; i < 6; i++) {
            if(data.gems[i * 3].gt(Decimal.dZero)) {
                getAchievement(45)
                break
            }
        }
    }
    if(!data.achievements[46]) {
        for(let i = 0; i < 6; i++) {
            if(data.gems[(i * 3)+1].gt(Decimal.dZero)) {
                getAchievement(46)
                break
            }
        }
    }
    if(!data.achievements[47]) {
        for(let i = 0; i < 6; i++) {
            if(data.gems[(i * 3)+2].gt(Decimal.dZero)) {
                getAchievement(47)
                break
            }
        }
    }

    if(!data.achievements[50]) {
        if(collectionBoost.gte(100))
            getAchievement(50)
    }

    if(!data.achievements[51]) {
        let check = true
        for(let i = 0; i < data.harvesters.length; i++) {
            if(data.harvesters[i].level < 20) {
                check = false
                break
            }
        }
        if(check) {
            getAchievement(51)
        }
    }

    if(!data.achievements[52]) {
        let check = true
        for(let i = 0; i < 6; i++) {
            if(data.artifacts[3 + (i * 4)].lte(0)) {
                check = false
                break
            }
        }
        for(let i = 0; i < 6; i++) {
            if(data.gems[2 + (i * 3)].lte(0)) {
                check = false
                break
            }
        }
        if(check) {
            getAchievement(52)
        }
    }
}

function updateAchClass() {
    for(let i = 0; i < achievementObjs.length; i++) {
            DOMCacheGetOrSet('ach'+i).classList = data.achievements[i] ? 'achUnlock' : 'achLock'
    }
    for(let i = 0; i < 19; i++) {
        DOMCacheGetOrSet('ach'+i).src = data.achievements[i] ? achievementObjs[i].img : `${eggImgPath}question.png`
    }
    for(let i = 19; i < achievementObjs.length; i++) {
        if(i >= 31 && i <= 36)
            DOMCacheGetOrSet('ach'+i).src = !data.achievements[i] ? 'Images/questionplanet.png' : achievementObjs[i].img
        else
            DOMCacheGetOrSet('ach'+i).src = achievementObjs[i].img
    }
    DOMCacheGetOrSet('achCompletionText').innerText = `Achievements Completed: ${getAchievementsCompleted()}/${achievementObjs.length} [${format(getAchievementsCompleted()/achievementObjs.length*100,2)}%]`
}
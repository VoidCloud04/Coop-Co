let diff = 0;
const eggImgPath = 'Images/Eggs/'

const subAmts = [4,4,3]
const subIDs = ['set','asc','evt']

function generateHTMLAndHandlers() {
    for(let i = 0; i < tabIDs.length; i++) {
        DOMCacheGetOrSet(`tabButton${i}`).addEventListener('click', () => {changeTab(i)})
    }
    DOMCacheGetOrSet('prestigeButton').addEventListener('click', () => {createConfirmation('prestige')})
    DOMCacheGetOrSet('eggPromoteButton').addEventListener('click', () => promoteEgg())
    DOMCacheGetOrSet('ascensionButton').addEventListener('click', () => {createConfirmation('ascension')})
    //Egg Tab
    DOMCacheGetOrSet('mainButton').addEventListener('click', () => {data.chickens = data.chickens.add(Decimal.dOne)})
    //Research Tab
    for(let i = 0; i < commonResearches.length; i++) {
        DOMCacheGetOrSet(`r${i}`).classList = 'redButton'
        DOMCacheGetOrSet(`r${i}`).onclick = () => purchaseResearch(i)
    }
    //Contracts Tab
    for(let i = 0; i < 3; i++) {
        DOMCacheGetOrSet(`infContractButton${i}`).addEventListener('click', () => {startContract(i)})
    }
    //Eggspeditions Tab
    DOMCacheGetOrSet('discoveryButton').addEventListener('click', () => {discoverPlanet()})
    DOMCacheGetOrSet('eggspeditionButton').addEventListener('click', () => {journeyToPlanet()})
    for(let i = 0; i < planetNames.length; i++) {
        DOMCacheGetOrSet('planet'+i).addEventListener('click', () => updatePlanetHoverText(i))
    }
    //Prestige Tab
    for(let i = 0; i < epicResearches.length; i++) {
        DOMCacheGetOrSet(`er${i}`).classList = 'redButton'
        DOMCacheGetOrSet(`er${i}`).onclick = () => purchaseEpicResearch(i)
    }

    //Ascension Tab

    for(let i = 0; i < data.legendaryResearch.length; i++) {
        DOMCacheGetOrSet(`lr${i}`).addEventListener('click',() => purchaseLegendaryResearch(i))
    }

    let count = 0;
    for(let i = 0; i <= parseInt(artifacts.length / 8); i++) {
        addHTML('artifactStorage',`<div id="artifactCol${i}" class="flexCol"></div>`)
        for(let j = 0; j < 8; j++) {
            if(count >= artifacts.length) break;
            addHTML(`artifactCol${i}`,`<img id="artifactSlot${count}" class="artifactSlot" src="Images/QuestionMark.png">`)
            count++
        }
    }

    for(let i = 0; i < artifacts.length; i++) {
        DOMCacheGetOrSet(`artifactSlot${i}`).addEventListener('click', () => updateAscensionHoverText(i,'artifact'))
        DOMCacheGetOrSet(`artifactSlot${i}`).addEventListener('click', () => selectArtifact(i))
    } 

    count = 0;
    addHTML('artifactStorage',`<div class="flexCol" style="width:4em"></div>`)
    for(let i = 0; i <= parseInt(gems.length / 6); i++) {
        addHTML('artifactStorage',`<div id="gemCol${i}" class="flexCol"></div>`)
        for(let j = 0; j < 6; j++) {
            if(count >= gems.length) break;
            addHTML(`gemCol${i}`,`<img id="gemSlot${count}" class="artifactSlot" src="Images/QuestionMark.png">`)
            count++
        }
    }

    for(let i = 0; i < gems.length; i++) {
        DOMCacheGetOrSet(`gemSlot${i}`).addEventListener('click', () => updateAscensionHoverText(i,'gem'))
        DOMCacheGetOrSet(`gemSlot${i}`).addEventListener('click', () => selectGem(i))
    } 

    for(let i = 0; i < data.activeArtifacts.length; i++) {
        DOMCacheGetOrSet(`artifactHolder${i}`).addEventListener('click', () => activateArtifactSelect(i))
    }

    for(let i = 0; i < data.activeGems.length; i++) {
        DOMCacheGetOrSet(`gemHolder${i}`).addEventListener('click',() => activateGemSelect(i))
    }

    DOMCacheGetOrSet(`harvesterUpgradeButton`).addEventListener('click', () => upgradeHarvester())
    DOMCacheGetOrSet('runAllHarvestersButton').addEventListener('click', () => {
        for(let i = 0; i < data.harvesters.length; i++)
            if(data.harvesters[i].level != 0)
                startHarvester(i)
    })
    
    for(let i = 0; i < data.harvesters.length; i++) {
        DOMCacheGetOrSet(`harvesterHolder${i}`).addEventListener('click',() => {updateHarvesterHoverText(i)})
        DOMCacheGetOrSet(`harvesterButton${i}`).addEventListener('click', () => startHarvester(i))
    }

    for(let i = 0; i < data.artifactLoadouts.length; i++) {
        DOMCacheGetOrSet(`artifactLoadoutButton${i}`).addEventListener('click',() => selectLoadout(i))
    }
    DOMCacheGetOrSet('saveLoadoutButton').addEventListener('click',() => saveLoadout())
    DOMCacheGetOrSet('loadLoadoutButton').addEventListener('click',() => loadLoadout())

    DOMCacheGetOrSet('artifactCraftingButton').addEventListener('click',() => craftArtifact())

    // count = 0;
    // addHTML('artifactStorage',`<div class="flexCol" style="width:4em"></div>`)
    // for(let i = 0; i <= parseInt(ingredients.length / 8); i++) {
    //     addHTML('artifactStorage',`<div id="ingredientCol${i}" class="flexCol"></div>`)
    //     for(let j = 0; j < 8; j++) {
    //         if(count >= ingredients.length) break;
    //         addHTML(`ingredientCol${i}`,`<img id="ingredientSlot${count}" class="artifactSlot" src="${ingredients[count].img}">`)
    //         count++
    //     }
    // }
    
    //Achievements Tab
    count = 0
    let achCount = 0
    for(let i = 0; i <= Math.floor(achievementDisplayArr.length / 8); i++) {
        addHTML('achievementHolder',`<div id="achCol${i}" class="flexCol"></div>`)
        for(let j = 0; j < 8; j++) {
            if(count >= achievementDisplayArr.length) break
            
            if(achievementDisplayArr[count] === 'ach') {
                if(achCount >= achievementObjs.length) break
                addHTML(`achCol${i}`,`<img id="ach${achCount}">`)
                if(achCount === 0)
                    DOMCacheGetOrSet(`ach0`).classList = 'achUnlock'
                achCount++
            }
            else {
                addHTML(`achCol${i}`,'<div class="achPlaceholder"></div>')
            }
            count++
        }
    }

    for(let i = 0; i < achievementObjs.length; i++) 
        DOMCacheGetOrSet(`ach${i}`).addEventListener('mouseover', () => updateAchText(i))
    //Automators

    for(let i = 0; i < data.buyAmounts.length; i++) {
        DOMCacheGetOrSet(`ba${i}`).addEventListener('click', () => toggleBA(i))
    }

    for(let i = 0; i < data.autoActive.length; i++) {
        DOMCacheGetOrSet(`auto${i}`).addEventListener('click', () => { toggleAuto(i) })
    }

    for(let i = 0; i < data.settingsToggles.length; i++) {
        if(i === 3)
            DOMCacheGetOrSet(`setTog${i}`).classList = data.settingsToggles[i] ? 'yellowButton' : 'blueButton'
        else if(i !== 0 && i !== 3)
            DOMCacheGetOrSet(`setTog${i}`).classList = data.settingsToggles[i] ? 'greenButton' : 'redButton'
        
        if(i === 1)
            DOMCacheGetOrSet(`setTog${i}`).addEventListener('click', () => {toggle(i);scrollNextMessage();})
        else
            DOMCacheGetOrSet(`setTog${i}`).addEventListener('click', () => {toggle(i)})
    }
    DOMCacheGetOrSet('saveButton').addEventListener('click', () => save())
    DOMCacheGetOrSet('exportButton').addEventListener('click',() => exportSave())
    DOMCacheGetOrSet('importButton').addEventListener('click',() => createPrompt('Import Save',0))
    DOMCacheGetOrSet('deleteButton').addEventListener('click', () => createConfirmation('reset'))

    for(let i = 0; i < subIDs.length; i++) {
        for(let j = 0; j < subAmts[i]; j++) {
            DOMCacheGetOrSet(`${subIDs[i]}SubButton${j}`).addEventListener('click',() => changeSubTab(i,j))
        }
    }

    const acc = document.getElementsByClassName("accordion");
    let i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
        this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
    });
    } 
}

function mainLoop() {
    diff = (Date.now()-data.time)*data.devSpeed/1000
    updateResearch()
    updateEggValueBonus()
    updateIntHatch()
    updateLayRate()
    updatePrestige()
    updateAscension()
    updateAutomation()
    if(data.chickens.lt(0))
        data.chickens = Decimal.dZero
    if(data.chickens.lt(1) && data.epicResearch[8].gte(epicResearches[8].maxLevel))
        data.chickens = Decimal.dOne
    for(let i = 0; i < data.contractActive.length; i++) {
        if(data.contractActive[i])
            runContract(i)
    }
    for(let i = 0; i < 6; i++) {
        planetBoosts[i] = data.planetData[i].money.gte(Decimal.dOne) ? Decimal.dOne.add(Decimal.sqrt(Decimal.log(data.planetData[i].money,5))) : Decimal.dOne
    }
    currentEggValue = data.onPlanet === false ? eggData[data.currentEgg].value.times(eggValueBonus) : planetEggValue[data.currentPlanetIndex].times(eggValueBonus)
    data.chickens = data.onPlanet === true && data.currentPlanetIndex === 1 ? data.chickens.add(chickenGain.times(diff/60)) : data.chickens.add(chickenGain.times(diff/15))

    if(data.onPlanet && (data.currentPlanetIndex === 1 || data.currentPlanetIndex === 2)) {
        if(data.currentPlanetIndex === 1) {
            data.money = data.money.add(((currentEggValue.times(soulEggBoost)).mul(diff/4)).times(data.chickens.times(layRate)))
        }
        else if(data.currentPlanetIndex === 2) {
            data.money = data.money.add(((currentEggValue)).times(data.chickens.times(layRate)))
        }
    }
    else {
        data.money = data.money.add(((currentEggValue.times(soulEggBoost)).mul(diff)).times(data.chickens.times(layRate)))
    }

    if(data.bestRunMoney.lt(data.money)) data.bestRunMoney = data.money
    //Stats Updates
    for(let i = data.unlockedEgg.length - 1; i > -1; i--) {
        if(data.unlockedEgg[i] === true) {
            data.stats.bestEgg = eggData[i+1].name
            break
        }
        if(i === 0 && data.unlockedEgg[i] === false) {
            data.stats.bestEgg = 'Regular'
        }
    }
    if(data.stats.bestMoney.lt(data.money)) data.stats.bestMoney = data.money
    if(data.stats.bestChickens.lt(data.chickens)) data.stats.bestChickens = data.chickens
    if(data.stats.bestSoulEggs.lt(data.bestSoulEggs)) data.stats.bestSoulEggs = data.bestSoulEggs
    if(data.stats.bestProphecyEggs.lt(data.prophecyEggs)) data.stats.bestProphecyEggs = data.prophecyEggs
    if(data.stats.bestKnowleggs.lt(data.bestKnowlegg)) data.stats.bestKnowleggs = data.prophecyEggs
    data.stats.timePlayed = data.stats.timePlayed.add(diff)
    data.stats.timeInPrestige = data.stats.timeInPrestige.add(diff)
    data.stats.timeInAscension = data.stats.timeInAscension.add(diff)
    if(!data.unlockedContracts && data.unlockedEgg[5]) data.unlockedContracts = true;
    if(!data.generatedContracts && data.unlockedContracts) {
        for(let i = 0; i < 3; i++)
            generateContract(i)
        data.generatedContracts = true
    }

    checkAchievements()
    
    if(Math.floor(getAchievementsCompleted()/data.achievements.length) === 1 && !data.stats.completedGame) {
        data.stats.completedGame = true
        data.stats.completionTime = data.stats.timePlayed
        createAlert('!!VICTORY!!',`Congratulations you beat Coop Co ${getDefaultObject().currentUpdate}\nin ${formatTime(data.stats.completionTime)}`,`var(--green)`)
    }
    
    updateHTML()
    if(DOMCacheGetOrSet('faviconLink').getAttribute('href') !== `${eggImgPath}${eggData[data.currentEgg].id}.png`)
        DOMCacheGetOrSet('faviconLink').href = `${eggImgPath}${eggData[data.currentEgg].id}.png`
    data.time = Date.now()
}
const tabIDs = ['egg','research','contracts','settings','prestige','eggpedition','achievement','ascension','events']
function changeTab(i) {
    data.currentTab = i
    for(let i = 0; i < tabIDs.length; i++) {
        DOMCacheGetOrSet(`${tabIDs[i]}Tab`).style.display = i === data.currentTab ? 'flex' : 'none'
        
    }
}

function changeSubTab(a,b) {
    
    data.currentSubTab[a] = b
    for(let i = 0; i < subAmts[a]; i++) {
        DOMCacheGetOrSet(`${subIDs[a]}Sub${i}`).style.display = i === data.currentSubTab[a] ? 'flex' : 'none'
    }
}

function toggle(i) {
    data.settingsToggles[i] = !data.settingsToggles[i]
    if(i === 3)
         DOMCacheGetOrSet(`setTog${i}`).classList = data.settingsToggles[i] ? 'yellowButton' : 'blueButton'
    else if(i !== 0)
        DOMCacheGetOrSet(`setTog${i}`).classList = data.settingsToggles[i] ? 'greenButton' : 'redButton'
}
function toggleBA(i) {
    data.buyAmounts[i] = data.buyAmounts[i] + 1 === BUY_AMOUNT_LABELS.length ? 0 : data.buyAmounts[i] + 1
    DOMCacheGetOrSet(`ba${i}`).innerText = `Buy Amount: ${BUY_AMOUNT_LABELS[data.buyAmounts[i]]}`
}

function updateStats() {
    // General Stats
    DOMCacheGetOrSet('stat0').textContent = `Best Money: $${format(data.stats.bestMoney)}`
    DOMCacheGetOrSet('stat1').textContent = `Best Egg: ${data.stats.bestEgg}`
    DOMCacheGetOrSet('stat2').textContent = `Best Chickens: ${format(data.stats.bestChickens)}`
    DOMCacheGetOrSet('stat3').textContent = `Contracts Completed: ${format(data.stats.contractsComplete)}`
    DOMCacheGetOrSet('stat4').textContent = `Time Played: ${formatTime(data.stats.timePlayed)}`
    // Prestige Stats
    DOMCacheGetOrSet('stat5').textContent = `Prestige 1: ${format(data.stats.prestiges[0])} Soul Eggs`
    DOMCacheGetOrSet('stat6').textContent = `Prestige 2: ${format(data.stats.prestiges[1])} Soul Eggs`
    DOMCacheGetOrSet('stat7').textContent = `Prestige 3: ${format(data.stats.prestiges[2])} Soul Eggs`
    DOMCacheGetOrSet('stat8').textContent = `Time In Current Prestige: ${formatTime(data.stats.timeInPrestige)}`
    DOMCacheGetOrSet('stat9').textContent = `Best Soul Eggs: ${format(data.stats.bestSoulEggs)}`
    DOMCacheGetOrSet('stat10').textContent = `Best Prophecy Eggs: ${format(data.stats.bestProphecyEggs)}`
    DOMCacheGetOrSet('stat16').textContent = `Average Soul Egg Gain: ${format((data.stats.prestiges[0].add(data.stats.prestiges[1]).add(data.stats.prestiges[2]).div(3)))}`
    //  Ascension Stats
    DOMCacheGetOrSet('stat11').textContent = `Ascension 1: ${format(data.stats.ascensions[0])} Knowleggs`
    DOMCacheGetOrSet('stat12').textContent = `Ascension 2: ${format(data.stats.ascensions[1])} Knowleggs`
    DOMCacheGetOrSet('stat13').textContent = `Ascension 3: ${format(data.stats.ascensions[2])} Knowleggs`
    DOMCacheGetOrSet('stat14').textContent = `Best Knowleggs: ${format(data.stats.bestKnowleggs)}`
    DOMCacheGetOrSet('stat15').textContent = `Time In Current Ascension: ${formatTime(data.stats.timeInAscension)}`
    DOMCacheGetOrSet('stat17').textContent = `Average Knowlegg Egg Gain: ${format((data.stats.ascensions[0].add(data.stats.ascensions[1]).add(data.stats.ascensions[2]).div(3)))}`
}

 function createAlert(title,content,borderColor) {
    DOMCacheGetOrSet('alertContainer').style.border = `2px solid ${borderColor}`
    DOMCacheGetOrSet('alertTitle').innerText = title
    DOMCacheGetOrSet('alertContent').innerText = content
    DOMCacheGetOrSet('alert').style.display = 'block'
    DOMCacheGetOrSet('alertContainer').style.display = 'block'
}

function createPrompt(a,b) {
    let old_element = document.getElementById("promptButton");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    DOMCacheGetOrSet('promptInput').value = ''
    DOMCacheGetOrSet('promptContainer').style.border = "4px solid whitesmoke"
    DOMCacheGetOrSet('promptTitle').innerText = a
    DOMCacheGetOrSet('prompt').style.display = 'block'
    DOMCacheGetOrSet('promptContainer').style.display = 'block'
    switch(b) {
        case 0:
            document.getElementById('promptButton').addEventListener('click', () => { importSave() })
            break
    }
}
function createConfirmation(a) {
    let old_element = document.getElementById("yesConfirm");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    old_element = document.getElementById("noConfirm");
    new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    switch(a) {
        case 'prestige':
            if(data.currentEgg < 3 || contractActive()) return
            if(!data.settingsToggles[4]) {prestige(); return}
            document.getElementById('confirmContainer').style.border = `4px solid var(--purple)`
            document.getElementById('confirmTitle').innerText = 'Are you sure you want to prestige?'
            document.getElementById('confirmContent').innerText = 'This will reset everything for Soul Eggs'
            document.getElementById('confirm').style.display = 'block'
            document.getElementById('confirmContainer').style.display = 'block'
            document.getElementById('noConfirm').addEventListener('click', () => {closeModal(2)})
            document.getElementById('yesConfirm').addEventListener('click', () => {prestige();closeModal(2)})
            break
        case 'reset':
            document.getElementById('confirmContainer').style.border = `4px solid var(--red)`
            document.getElementById('confirmTitle').innerText = 'Are you sure you want to reset your game?'
            document.getElementById('confirmContent').innerText = 'This will export your savefile to the clipboard but delete your save game in local storage.'
            document.getElementById('confirm').style.display = 'block'
            document.getElementById('confirmContainer').style.display = 'block'
            document.getElementById('noConfirm').addEventListener('click', () => {closeModal(2)})
            document.getElementById('yesConfirm').addEventListener('click', () => {fullReset();closeModal(2)})
            break
        case 'ascension':
            if(data.money.lt(1e45) || data.currentEgg !== 18) return
            if(!data.settingsToggles[5]) {ascend(); return}
            document.getElementById('confirmContainer').style.border = `4px solid var(--orange)`
            document.getElementById('confirmTitle').innerText = 'Are you sure you want to ascend?'
            document.getElementById('confirmContent').innerText = 'This will reset everything for Knowleggs'
            document.getElementById('confirm').style.display = 'block'
            document.getElementById('confirmContainer').style.display = 'block'
            document.getElementById('noConfirm').addEventListener('click', () => {closeModal(2)})
            document.getElementById('yesConfirm').addEventListener('click', () => {ascend();closeModal(2)})
            break
    }
}
function closeModal(i) {
    switch(i) {
        case 0:
            document.getElementById('alertContainer').style.display = 'none'
            document.getElementById('alert').style.display = 'none'
            break
        case 1:
            document.getElementById('promptContainer').style.display = 'none'
            document.getElementById('prompt').style.display = 'none'
            break
        case 2:
            document.getElementById('confirm').style.display = 'none'
            document.getElementById('confirmContainer').style.display = 'none'
            break
    }
}

window.setInterval(function() {
    mainLoop()
},60)

function updateHTML() {
    //Globals
    DOMCacheGetOrSet('moneyText').textContent = `$${format(data.money)}`
    DOMCacheGetOrSet('chickensText').textContent = `Chickens: ${format(data.chickens)}`
    if(!data.onPlanet) {
        if(DOMCacheGetOrSet('currentEggImgHeader').getAttribute('src') !== `${eggImgPath}${eggData[data.currentEgg].id}.png`) 
        DOMCacheGetOrSet('currentEggImgHeader').setAttribute('src', `${eggImgPath}${eggData[data.currentEgg].id}.png`)
    }   
    else {
        if(DOMCacheGetOrSet('currentEggImgHeader').getAttribute('src') !== `${eggImgPath}${planetEggImgIDs[data.currentPlanetIndex]}.png`) 
        DOMCacheGetOrSet('currentEggImgHeader').setAttribute('src', `${eggImgPath}${planetEggImgIDs[data.currentPlanetIndex]}.png`)
    }
    DOMCacheGetOrSet('eggPromoteButton').style.display = data.currentEgg >= eggData.length-1 || contractActive() || data.onPlanet === true ? 'none' : 'inline-block'
    if(data.currentEgg < eggData.length-1 && !data.onPlanet) {
        const currentEggDiscoverReq = eggData[data.currentEgg+1].discoverReq.max(1.01)
        const currentEggUnlockReq = eggData[data.currentEgg+1].unlockReq.max(1.02)
        const nextEggDiscoverProgress = data.money.max(1).log10().div(currentEggDiscoverReq.log10())
        const nextEggUnlockProgress = data.money.div(currentEggDiscoverReq).max(1).log10().div(currentEggUnlockReq.div(currentEggDiscoverReq).log10())
        DOMCacheGetOrSet('eggPromoteButton').style.setProperty("--y", nextEggDiscoverProgress.mul(100).max(0).min(100).toString() + '%')
        DOMCacheGetOrSet('eggPromoteButton').style.setProperty("--x", nextEggUnlockProgress.mul(100).max(0).min(100).toString() + '%')
        DOMCacheGetOrSet('eggPromoteButton').classList = data.money.gte(eggData[data.currentEgg+1].unlockReq) ? 'greenButtonPromote' : 'redButtonPromote'
    }
    DOMCacheGetOrSet('tabButton4').style.display = data.hasPrestiged || data.currentEgg >= 3 ? 'block' : 'none'
    DOMCacheGetOrSet('prestigeButton').classList = data.currentEgg < 3 ? 'redButtonHeader' : 'purpleButtonHeader'
    DOMCacheGetOrSet('prestigeButton').style.display = contractActive() || data.onPlanet === true ? 'none' : 'block'
    DOMCacheGetOrSet('prestigeButton').textContent = data.currentEgg < 3 ? 'Reach Rocket Fuel Eggs' : `Prestige: +${format(soulEggGain)} Soul Eggs`
    DOMCacheGetOrSet('newsHolder').style.display = data.settingsToggles[1] ? 'block' : 'none'
    DOMCacheGetOrSet('tabButton2').style.display = !data.onPlanet && data.unlockedContracts ? 'block' : 'none'
    DOMCacheGetOrSet('ascensionButton').style.display = data.currentEgg >= 18 ? 'block' : 'none'
    DOMCacheGetOrSet('ascensionButton').classList = data.currentEgg >= 18 && data.money.gte(1e45) ? 'orangeButtonHeader' : 'redButtonHeader'
    DOMCacheGetOrSet('ascensionButton').innerText = data.currentEgg >= 18 && data.money.gte(1e45) ? `Ascend: +${format(knowleggGain)} Knowleggs` : `Ascend: ($${format(data.money)}/${format(1e45)})`
    DOMCacheGetOrSet('tabButton7').style.display = data.hasAscended || data.currentEgg >= 18 ? 'block' : 'none'
    DOMCacheGetOrSet('ascSubButton1').style.display = data.legendaryResearch[1].gte(legendaryResearches[1].max) ? 'block' : 'none'
    DOMCacheGetOrSet('ascSubButton2').style.display = data.legendaryResearch[1].gte(legendaryResearches[1].max) ? 'block' : 'none'
    DOMCacheGetOrSet('ascSubButton3').style.display = data.legendaryResearch[3].gte(legendaryResearches[3].max) ? 'block' : 'none'
    //hm
    DOMCacheGetOrSet('tabButton5').style.display = data.unlockedEgg[3] === true ? 'block' : 'none'
    switch (data.currentTab) {
        case 0:
            updateEggPage();
            break;
        case 1:
            updateCommonResearchHTML();
            for (let i = 0; i < 2; i++) {
                const autoElement = DOMCacheGetOrSet(`auto${i}`);
                autoElement.style.display = data.epicResearch[6 + i].gte(epicResearches[6 + i].maxLevel) ? 'inline-block' : 'none';
                autoElement.classList = data.autoActive[i] ? 'greenButton' : 'redButton';
                autoElement.innerText = data.autoActive[i] ? `${autoNames[i]}: On` : `${autoNames[i]}: Off`;
            }
            const auto3Element = DOMCacheGetOrSet(`auto3`);
            auto3Element.style.display = data.epicResearch[10].gte(epicResearches[10].maxLevel) ? 'inline-block' : 'none';
            auto3Element.classList = data.autoActive[3] ? 'greenButton' : 'redButton';
            auto3Element.innerText = data.autoActive[3] ? `${autoNames[3]}: On` : `${autoNames[3]}: Off`;
            break;
        case 2:
            updateContractsHTML();
            break;
        case 3:
            switch (data.currentSubTab[0]) {
                case 0:
                    DOMCacheGetOrSet(`setTog0`).innerText = data.settingsToggles[0] ? `Notation: Mixed Sci` : `Notation: Sci`;
                    DOMCacheGetOrSet(`setTog1`).innerText = data.settingsToggles[1] ? `Newsticker: On` : `Newsticker: Off`;
                    DOMCacheGetOrSet(`setTog2`).innerText = data.settingsToggles[2] ? `Contract Notifications: On` : `Contract Notifications: Off`;
                    DOMCacheGetOrSet(`setTog3`).innerText = data.settingsToggles[3] ? `Auto Promote Stops at: Enlightenment` : `Auto Promote Stops at: Universe`;
                    DOMCacheGetOrSet(`setTog4`).innerText = data.settingsToggles[4] ? `Prestige Confirmation: On` : `Prestige Confirmation: Off`;
                    DOMCacheGetOrSet(`setTog5`).innerText = data.settingsToggles[5] ? `Ascension Confirmation: On` : `Ascension Confirmation: Off`;
                    DOMCacheGetOrSet(`setTog6`).innerText = data.settingsToggles[6] ? `Harvester Notifications: On` : `Harvester Notifications: Off`;
                    break;
                case 1:
                    updateStats();
                    break;
                case 3:
                    DOMCacheGetOrSet('help0').style.display = data.hasPrestiged ? 'block' : 'none';
                    DOMCacheGetOrSet('help1').style.display = data.hasPrestiged ? 'block' : 'none';
                    DOMCacheGetOrSet('help2').style.display = data.unlockedEgg[3] ? 'block' : 'none';
                    DOMCacheGetOrSet('help3').style.display = data.unlockedContracts ? 'block' : 'none';
                    DOMCacheGetOrSet('help4').style.display = data.hasAscended ? 'block' : 'none';
                    DOMCacheGetOrSet('help5').style.display = data.hasAscended ? 'block' : 'none';
                    DOMCacheGetOrSet('help6').style.display = data.legendaryResearch[1].gte(legendaryResearches[1].max) ? 'block' : 'none';
                    DOMCacheGetOrSet('help7').style.display = data.legendaryResearch[1].gte(legendaryResearches[1].max) ? 'block' : 'none';
                    DOMCacheGetOrSet('help8').style.display = data.legendaryResearch[3].gte(legendaryResearches[3].max) ? 'block' : 'none';
                    break;
            }
            break;
        case 4:
            DOMCacheGetOrSet('soulEggText').innerText = `Soul Eggs: ${format(data.soulEggs)}\nBest Soul Eggs: ${format(data.bestSoulEggs)}\nEarnings Boost: x${format(soulEggBoost)}`;
            DOMCacheGetOrSet('prophecyEggText').innerText = `Prophecy Eggs: ${format(data.prophecyEggs)}\nSoul Boost: x${format(prophecyEggBoost)}\nContract Reward Boost: x${format(contractRewardBoost)}`;
            for (let i = 0; i < epicResearchCost.length; i++) {
                const erElement = DOMCacheGetOrSet(`er${i}`);
                if (data.epicResearch[i].lt(epicResearches[i].maxLevel)) {
                    if (data.buyAmounts[1] === 0)
                        erElement.classList = data.soulEggs.gte(epicResearchCostDisplay[i]) ? 'purpleButton' : 'redButton';
                    else if (data.buyAmounts[1] !== 0 && data.soulEggs.gte(epicResearchCost[i]))
                        erElement.classList = data.soulEggs.gte(epicResearchCostDisplay[i]) ? 'purpleButton' : 'yellowButton';
                    else
                        erElement.classList = 'redButton';
                } else {
                    erElement.classList = 'blueButton';
                }
            }
            for (let i = 0; i < epicResearches.length; i++) {
                DOMCacheGetOrSet(`er${i}`).innerText = data.epicResearch[i].lt(epicResearches[i].maxLevel)
                    ? `${epicResearches[i].name}\n${epicResearches[i].desc}\nLevel: ${toPlaces(data.epicResearch[i], 0, epicResearches[i].maxLevel.add(Decimal.dOne))}/${toPlaces(epicResearches[i].maxLevel, 0, epicResearches[i].maxLevel.add(Decimal.dOne))}\nCost: ${format(epicResearchCostDisplay[i])} Soul Eggs`
                    : `${epicResearches[i].name}\n${epicResearches[i].desc}\nLevel: ${toPlaces(data.epicResearch[i], 0, epicResearches[i].maxLevel.add(Decimal.dOne))}/${toPlaces(epicResearches[i].maxLevel, 0, epicResearches[i].maxLevel.add(Decimal.dOne))}\nCost: [MAXED]`;
            }
            DOMCacheGetOrSet('prophecyEggSoftCapText').innerText = prophecyEggBoost.gte(1e6) ? `Prophecy Egg Boost is being divided by: ${format(softCapAmts[1])}` : `Prophecy Egg Boost Softcap takes effect at ${format(D(1e6))}`;
            DOMCacheGetOrSet('auto2').style.display = data.epicResearch[9].gte(epicResearches[9].maxLevel) ? 'inline-block' : 'none';
            DOMCacheGetOrSet(`auto2`).classList = data.autoActive[2] ? 'greenButton' : 'redButton';
            DOMCacheGetOrSet(`auto2`).innerText = data.autoActive[2] ? `${autoNames[2]}: On` : `${autoNames[2]}: Off`;
            DOMCacheGetOrSet('auto4').style.display = data.legendaryResearch[2].gte(legendaryResearches[2].max) ? 'inline-block' : 'none';
            DOMCacheGetOrSet(`auto4`).classList = data.autoActive[4] ? 'greenButton' : 'redButton';
            DOMCacheGetOrSet(`auto4`).innerText = data.autoActive[4] ? `${autoNames[4]}: On` : `${autoNames[4]}: Off`;
            break;
        case 5:
            updateEggspeditionsUI();
            break;
        case 7:
            updateAscensionHTML();
            break;
        case 8:
            updateEventsHTML()
}

}

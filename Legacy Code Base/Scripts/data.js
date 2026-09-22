//create all the variables in a data object for saving
function getDefaultObject() {
    return {
        money: Decimal.dZero,
        bestRunMoney: Decimal.dZero,
        chickens: Decimal.dZero,
        soulEggs: Decimal.dZero,
        prophecyEggs: Decimal.dZero,
        bestSoulEggs: Decimal.dZero,
        hasPrestiged: false,
        contracts: [{id: -1, goal: Decimal.dZero, reward: Decimal.dZero},{id: -1, goal: Decimal.dZero, reward: Decimal.dZero},{id: -1, goal: Decimal.dZero, reward: Decimal.dZero}],
        unlockedContracts: false,
        generatedContracts: false,
        contractActive: new Array(3).fill(false),
        currentEgg: 0,
        unlockedEgg: new Array(18).fill(false),
        research: new Array(28).fill(Decimal.dZero),
        epicResearch: new Array(11).fill(Decimal.dZero),
        autoActive: new Array(5).fill(false),
        planetsDiscovered: new Array(6).fill(false),
        discoveries: 0,
        currentPlanetIndex: 0,
        onPlanet: false,
        planetData: [{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)},{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)},{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)},{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)},{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)},{money: Decimal.dZero, chickens: Decimal.dZero, research: new Array(28).fill(Decimal.dZero)}],
        achievements: new Array(48).fill(false),
        knowlegg: Decimal.dZero,
        bestKnowlegg: Decimal.dZero,
        hasAscended: false,
        legendaryResearch: new Array(6).fill(Decimal.dZero),
        artifacts: new Array(24).fill(Decimal.dZero),
        gems: new Array(18).fill(Decimal.dZero),
        unlockedArtifact: new Array(24).fill(false),
        unlockedGem: new Array(18).fill(false),
        activeArtifacts: new Array(4).fill(-1),
        activeGems: new Array(12).fill(-1),
        harvesters: [{level:0,timeRemaining:0,running:false},{level:0,timeRemaining:0,running:false},{level:0,timeRemaining:0,running:false},{level:0,timeRemaining:0,running:false},{level:0,timeRemaining:0,running:false},{level:0,timeRemaining:0,running:false}],
        artifactLoadouts: [
            {
                artifactIDs: new Array(4).fill(-1),
                gemIDs: new Array(12).fill(-1)
            },
            {
                artifactIDs: new Array(4).fill(-1),
                gemIDs: new Array(12).fill(-1)
            },
            {
                artifactIDs: new Array(4).fill(-1),
                gemIDs: new Array(12).fill(-1)
            },
        ],
        currentLoadout: 0,
        stats: {
            bestMoney: Decimal.dZero,
            bestEgg: '',
            bestChickens: Decimal.dZero,
            contractsComplete: Decimal.dZero,
            timePlayed: Decimal.dZero,
            prestiges: [Decimal.dZero,Decimal.dZero,Decimal.dZero],
            ascensions: [Decimal.dZero,Decimal.dZero,Decimal.dZero],
            timeInPrestige: Decimal.dZero,
            timeInAscension: Decimal.dZero,
            bestSoulEggs: Decimal.dZero,
            bestProphecyEggs: Decimal.dZero,
            bestKnowleggs: Decimal.dZero,
            completedGame: false,
            completionTime: Decimal.dZero
        },
        buyAmounts: [0,0,0],
        time: Date.now(),
        currentTab: 0,
        currentSubTab: new Array(3).fill(0),
        settingsToggles: new Array(7).fill(true),
        currentUpdate: 'v2.0.3',
        devSpeed: 1,
    }
}

//End Game enlightenment save
let data = getDefaultObject()
//saving and loading
const saveName = 'coopCo'
function save(){
    window.localStorage.setItem(saveName, JSON.stringify(data))
    generateNotification('Game Saved','info')
}
const BUY_AMOUNT_LABELS = ['1', '5', '10', '20', 'Max'];
const BUY_AMOUNT_NUMBERS = [1, 5, 10, 20, 9999];
function load() {
    let savedata = JSON.parse(window.localStorage.getItem(saveName))
    if(savedata === null || savedata === undefined) savedata = getDefaultObject()
    else if (savedata !== undefined) fixSave(data, savedata)
    //Update 1.0.0 Saves to Current Version
    if(data.currentUpdate !== getDefaultObject().currentUpdate){
        createAlert("Welcome Back!",`The current version is ${getDefaultObject().currentUpdate}, View the Changelog (in settings) for details`,"812626")
        data.currentUpdate = getDefaultObject().currentUpdate 
        for(let i = 0; i < 3; i++) {
            if(data.contracts[i].reward.eq(Decimal.dZero)) {
                data.generatedContracts = false 
                data.contractActive[i] = false
            }
                
        }
    }
    for(let i = 0; i < data.buyAmounts.length; i++) {
        const numString = BUY_AMOUNT_LABELS
        DOMCacheGetOrSet(`ba${i}`).innerText = `Buy Amount: ${numString[data.buyAmounts[i]]}`
    }
}
//fix saves
function fixSave(main=getDefaultObject(), data) {
    if (typeof data === "object") {
        Object.keys(data).forEach(i => {
            if (main[i] instanceof Decimal) {
                main[i] = D(data[i]!==null?data[i]:main[i])
            } else if (typeof main[i]  == "object") {
                fixSave(main[i], data[i])
            } else {
                main[i] = data[i]
            }
        })
        return main
    }
    else return getDefaultObject()
}
function exportSave(){
    save()
    let exportedData = btoa(JSON.stringify(data));
    const exportedDataText = document.createElement("textarea");
    exportedDataText.value = exportedData;
    document.body.appendChild(exportedDataText);
    exportedDataText.select();
    exportedDataText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(exportedDataText);
    generateNotification('Save File Exported to Clip Board','success')
}
function importSave(){
    let importedData = DOMCacheGetOrSet('promptInput').value
    if(importedData.length <= 0 || importedData === undefined) {
        generateNotification('No Data Imported','error')
        DOMCacheGetOrSet('promptContainer').style.display = 'none'
        return
    }
    else if(importedData.toLowerCase() === '69' || importedData.toLowerCase() === '420'){
        generateNotification('Nice','success')
        DOMCacheGetOrSet('promptContainer').style.display = 'none'
        return
    }
    data = Object.assign(getDefaultObject(), JSON.parse(atob(importedData)))
    save()
    location.reload()
}
window.setInterval(function(){
    save()
}, 30000);
window.onload = function (){
    let currTime = Date.now()
    load()
    generateHTMLAndHandlers()
    diff = (Date.now()-data.time)*data.devSpeed/1000
    generateNotification('Welcome Back!\nYou were gone for ' + formatTime(diff), 'info')
    
    changeTab(data.currentTab)
    for(let i = 0; i < data.currentSubTab.length; i++) {
        changeSubTab(i,data.currentSubTab[i])
    }
    scrollNextMessage()
    DOMCacheGetOrSet('currentVersionText').innerText = `Current Version: ${getDefaultObject().currentUpdate}`
    generateNotification('Game Loaded','info')
    updateAchClass()
    updateCommonResearchHTML()
    //const themeDisplayNames = ['Original','Void Stream','Flashbang']
    //DOMCacheGetOrSet('setTog4').innerText = `Theme: ${themeDisplayNames[data.themeIndex]}`
    //setTheme()
    let timeComp = Date.now() - currTime
    console.log(`Game Loaded in ${timeComp}ms`)
}
//full reset
function fullReset(){
    exportSave()
    window.localStorage.removeItem(saveName)
    location.reload()
}
function deleteSave(){
        window.localStorage.removeItem(saveName)
        location.reload()
}

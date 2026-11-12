import Decimal from "break_eternity.js"
import { gameState } from "./DataManager.svelte"

export const planets = [
    {
        name: "Arcturus",
        imgSrc: "Images/planet1.png",
        eggName: "Dark Energy",
        eggImgSrc: "Images/Eggs/darkenergy.png",
        bonusName: "Egg Value",
        bonusValues: []
    },
    {
        name: "Ravnar",
        imgSrc: "Images/planet2.png",
        eggName: "Time",
        eggImgSrc: "Images/Eggs/time.png",
        bonusName: "Egg Laying Rate",
        bonusValues: []
    },
        {
        name: "Xylok",
        imgSrc: "Images/planet3.png",
        eggName: "Peace",
        eggImgSrc: "Images/Eggs/peace.png",
        bonusName: "Enlightenment Egg Value",
        bonusValues: []
    },
    {
        name: "Triton",
        imgSrc: "Images/planet4.png",
        eggName: "Abyss",
        eggImgSrc: "Images/Eggs/abyss.png",
        bonusName: "Chicken Gain",
        bonusValues: []
    },
    {
        name: "Hereth",
        imgSrc: "Images/planet5.png",
        eggName: "Lava",
        eggImgSrc: "Images/Eggs/lava.png",
        bonusName: "Research Discount",
        bonusValues: []
    },
    {
        name: "Malak",
        imgSrc: "Images/planet6.png",
        eggName: "Radiant",
        eggImgSrc: "Images/Eggs/radiant.png",
        bonusName: "Soul Egg Gain",
        bonusValues: []
    },
]

export const hiddenPlanetImg = 'Images/questionplanet.png'
const basePlanetCost = new Decimal(1000)
const planetDiscoveryScale = new Decimal(10)

export function calculatePlanetsUnlocked() {
    return gameState.data.progression.unlockedPlanet.filter(item => item === true).length
}

export function calculateDiscoveryCost() {
    const planetsUnlocked = calculatePlanetsUnlocked()
    return planetsUnlocked === 0 ? basePlanetCost : basePlanetCost.times(Decimal.pow(planetDiscoveryScale,planetsUnlocked))
}

export function discoverPlanet(index) {
    const discoveryCost = calculateDiscoveryCost()
    if(gameState.data.currency.soulEggs.lt(discoveryCost)) return
    if(gameState.data.progression.unlockedPlanet[index]) return

    gameState.data.progression.unlockedPlanet[index] = true
    gameState.data.currency.soulEggs = gameState.data.currency.soulEggs.minus(discoveryCost)
}

export function journeyToPlanet(index) {

}

export function completePlanet() {

}

export function exitPlanet() {
    
}

export function completeHarvester() {

}
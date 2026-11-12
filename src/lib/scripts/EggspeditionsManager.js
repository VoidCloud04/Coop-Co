import Decimal from "break_eternity.js"
import { gameState } from "./DataManager.svelte"

export const planets = [
    {
        name: "Arcturus",
        imgSrc: "Images/planet1.png",
        eggName: "Dark Energy",
        eggImgSrc: "Images/Eggs/darkenergy.png"
    },
    {
        name: "Ravnar",
        imgSrc: "Images/planet2.png",
        eggName: "Time",
        eggImgSrc: "Images/Eggs/time.png"
    },
        {
        name: "Xylok",
        imgSrc: "Images/planet3.png",
        eggName: "Peace",
        eggImgSrc: "Images/Eggs/peace.png"
    },
    {
        name: "Triton",
        imgSrc: "Images/planet4.png",
        eggName: "Abyss",
        eggImgSrc: "Images/Eggs/abyss.png"
    },
    {
        name: "Hereth",
        imgSrc: "Images/planet5.png",
        eggName: "Lava",
        eggImgSrc: "Images/Eggs/lava.png"
    },
    {
        name: "Malak",
        imgSrc: "Images/planet6.png",
        eggName: "Radiant",
        eggImgSrc: "Images/Eggs/radiant.png"
    },
]

export const hiddenPlanetImg = 'Images/questionplanet.png'
const basePlanetCost = new Decimal(1000)
const planetDiscoveryScale = new Decimal(0.25)

export function calculatePlanetsUnlocked() {
    return gameState.data.progression.unlockedPlanet.filter(item => item === true).length
}

export function calculateDiscoveryCost() {
    return basePlanetCost.times(Decimal.dOne.plus(Decimal.pow(0.25,calculatePlanetsUnlocked())))
}

export function discoverPlanet(index) {
    const discoveryCost = calculateDiscoveryCost()
    if(gameState.data.currency.soulEggs.lt(discoveryCost)) return
    if(gameState.data.progression.unlockedPlanet[index]) return
    gameState.data.progression.unlockedPlanet
}

export function journeyToPlanet(index) {

}

export function completePlanet() {

}

export function exitPlanet() {
    
}

export function completeHarvester() {

}
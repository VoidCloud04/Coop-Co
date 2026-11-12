<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Header from "$lib/components/Header.svelte";
    import Newsticker from "$lib/components/Newsticker.svelte";
    import TabContentSeparator from "$lib/components/TabContentSeparator.svelte";
    import { Export, gameState, Load, Save } from "$lib/scripts/DataManager.svelte"; // The global data object for all of the UI updates (& logic handled in the JavaScript Functions)
    import { commonByTier } from "$lib/scripts/ResearchManager";
    import { onMount } from "svelte";
    import Achievements from "./Achievements.svelte";
    import Ascension from "./Ascension.svelte";

    import Contracts from "./Contracts.svelte";

    import Egg from "./Egg.svelte";
    import Eggspeditions from "./Eggspeditions.svelte";
    import Prestige from "./Prestige.svelte";
    import Research from "./Research.svelte";
    import Settings from "./Settings.svelte";
    import { updateGameData } from "$lib/scripts/Main.svelte";
    import PlanetHeader from "$lib/components/Planet-UIs/PlanetHeader.svelte";
    import Planet from "./Planet.svelte";

    // Variable Definitions
    let data = $derived(gameState.data)
    let tabIndex = $state(0)
    let tabs = $state([
        {title: () => gameState.data.indexValues.currentPlanet === -1 ? 'Eggs' : 'Planet', class: "", condition: () => {return true}},
        {title: "Research", class: "", condition: () => {return true}},
        {title: "Contracts", class: "", condition: () => {return gameState.data.progression.unlockedContracts}},
        {title: "Eggspeditions", class: "button-blue", condition: () => {return gameState.data.progression.unlockedEggspeditions}},
        {title: "Prestige", class: "button-purple", condition: () => {return gameState.data.progression.hasPrestiged}},
        {title: "Ascension", class: "button-orange", condition: () => {return gameState.data.progression.hasAscended}},
        {title: "Achievements", class: "", condition: () => {return true}},
        {title: "Settings", condition: () => {return true}}
    ])

    function changeTab(i) {
        console.log(i)
        tabIndex = i
    }
    const commonTiers = commonByTier()
    let commonCollapsed = $state(commonTiers.map(() => true))
    
    onMount(() => {
        
        Load()
        requestAnimationFrame(updateGameData)
        window.setInterval(Save,30000)
    })
</script>
{#if gameState.data.indexValues.currentPlanet === -1}
    <Header style="margin-top: 0;"/>
{:else}
    <PlanetHeader />
{/if}
{#if data.settings.toggles[1]}
    <Newsticker />
{/if}
<ButtonGroup buttonArr={tabs} onclick={changeTab} baseId="tab-button"/>
{#if tabIndex === 0}
    <TabContentSeparator />
    {#if gameState.data.indexValues.currentPlanet === -1}
        <Egg />
    {:else}
        <Planet />
    {/if}
{:else if tabIndex === 1}
    <TabContentSeparator />
    <Research bind:collapsed={commonCollapsed}/>
{:else if tabIndex === 2 && gameState.data.indexValues.currentPlanet === -1}
    <TabContentSeparator />
    <Contracts />
{:else if tabIndex === 3}
    <TabContentSeparator />
    <Eggspeditions />
{:else if tabIndex === 4}
    <TabContentSeparator />
    <Prestige />
{:else if tabIndex === 5}
    <TabContentSeparator />
    <Ascension />
{:else if tabIndex === 6}
    <TabContentSeparator />
    <Achievements />
{:else if tabIndex === 7}
    <TabContentSeparator />
    <Settings />
{:else}
    <TabContentSeparator />
    <h1>Invalid Tab Selected</h1>
{/if}

<style lang="scss">

</style>
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

    // Variable Definitions
    let tabIndex = $state(0)
    let showNewsTicker = $state(true)
    let tabs = $state([
        {title: "Eggs", class: ""},
        {title: "Research"},
        {title: "Contracts"},
        {title: "Eggspeditions", class: "button-blue"},
        {title: "Prestige", class: "button-purple"},
        {title: "Ascension", class: "button-orange"},
        {title: "Achievements"},
        {title: "Settings"}
    ])

    function changeTab(i) {
        console.log(i)
        tabIndex = i
    }
    const commonTiers = commonByTier()
    let commonCollapsed = $state(commonTiers.map(() => true))
    
    onMount(() => {
        
        Load()
    })
</script>
<!-- Main Game Page Content / Will be not rendered during planets -->
<Header style="margin-top: 0;"/>
{#if showNewsTicker}
    <Newsticker />
{/if}
<ButtonGroup buttonArr={tabs} onclick={changeTab} baseId="tab-button"/>
{#if tabIndex === 0}
    <TabContentSeparator />
    <Egg />
{:else if tabIndex === 1}
    <TabContentSeparator />
    <Research bind:collapsed={commonCollapsed}/>
{:else if tabIndex === 2}
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
<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Header from "$lib/components/Header.svelte";
    import Newsticker from "$lib/components/Newsticker.svelte";
    import { data } from "$lib/scripts/DataManager.svelte"; // The global data object for all of the UI updates (& logic handled in the JavaScript Functions)
    import Ascension from "./Ascension.svelte";

    import Contracts from "./Contracts.svelte";

    import Egg from "./Egg.svelte";
    import Eggspeditions from "./Eggspeditions.svelte";
    import Prestige from "./Prestige.svelte";
    import Research from "./Research.svelte";
    import Settings from "./Settings.svelte";

    // Imports

    // Variable Definitions
    let tabIndex = $state(-1)
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
        tabIndex = i
    }
</script>

<Header />
{#if showNewsTicker}
    <Newsticker />
{/if}
<ButtonGroup buttonArr={tabs} onclick={changeTab} baseId="tab-button"/>

{#if tabIndex === 0}
    <Egg />
{:else if tabIndex === 1}
    <Research />
{:else if tabIndex === 2}
    <Prestige />
{:else if tabIndex === 3}
    <Contracts />
{:else if tabIndex === 4}
    <Eggspeditions />
{:else if tabIndex === 5}
    <Ascension />
{:else if tabIndex === 6}
    <Settings />
{:else}
    <h1>Invalid Tab Selected</h1>
    <button class="button-blue">Hello I'm a Button</button>
{/if}


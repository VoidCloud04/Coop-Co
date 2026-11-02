<script>
    import { DeleteSave, Export, gameState, Import, Save } from "$lib/scripts/DataManager.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import { confirmModal, promptModal } from "$lib/scripts/ModalManager.svelte";
    import { format } from "$lib/scripts/Utilities";
    import { eggs } from "$lib/scripts/EggManager";
    import { formatTime } from "$lib/scripts/Formatting";
    let data = $derived(gameState.data)
    let tabs = $state([
    {title: "Settings", class: ""},
    {title: "Stats", class: ""},
    {title: "Help"}
    ])
    let highestEgg = $derived(data.progression.achievements.slice(0,19).findLastIndex((element) => element))
    let subTab = $state(0)
    function changeTab(i) {
        subTab =i
        if(subTab >= tabs.length)
            subTab = 0
    }

    async function importClicked() {
        const text = await promptModal({
            title: 'Import Save',
            placeholder: 'Paste your save here',
            confirmText: 'Submit'
        })

        if (text !== null) Import(text)
    }

    async function deleteClicked() {
        const confirmed = await confirmModal({
            title: 'Are you sure you want to reset your game?',
            content: 'This will export your savefile to the clipboard but delete your save game in local storage.',
            color: 'red'
        })

        if (confirmed) DeleteSave()
    }

    function toggle(index) {
        data.settings.toggles[index] = !data.settings.toggles[index]
        //console.log(data.settings.toggles[index])
    }
</script>

<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if subTab === 0}
    <div class="flexRow">
        <button class="button-green" onclick={Save}>Save Game</button>
        <button onclick={importClicked}>Import Save</button>
        <button onclick={Export}>Export Save</button>
        <button class="button-red" onclick={deleteClicked}>Delete Save</button>
    </div>
    <div class="flexRow">
        <button onclick={() => toggle(0)}
        >Notation: {data.settings.toggles[0] ? "Mixed Sci" : "Sci"}</button>
        <button
            class={data.settings.toggles[1] ? 'button-green' : 'button-red'}
            onclick={() => toggle(1)}
        >
            Newsticker: {data.settings.toggles[1] ? 'On' : 'Off'}
        </button>
        <button class={data.settings.toggles[2] ? 'button-green' : 'button-red'}
        onclick={() => toggle(2)}>Contract Notifications: {data.settings.toggles[2] ? 'On' : 'Off'}</button>
        <button class={data.settings.toggles[3] ? "button-blue" : 'button-yellow'}
        onclick={() => toggle(3)}>
        Auto Promotion Stops At: {data.settings.toggles[3] ? 'Universe' : 'Enlightenment'}</button>
    </div>
    <div class="flexRow">
        <button class={data.settings.toggles[4] ? "button-green" : 'button-red'}
        onclick={() => toggle(4)}>
        Prestige Confirmation: {data.settings.toggles[4] ? 'On' : 'Off'}</button>
        <button class={"button-green"}>Ascension Confirmation: On</button>
        <button class={"button-green"}>Harvester Notifications: On</button>
    </div>
{:else if subTab === 1}
    <div class="flexRow">
        <div class="flexCol statHolder">
            <h3>General Stats</h3>
            <p>Best Money: <span class="green">${format(data.stats.bestMoney)}</span> </p>
            <p>Best Chickens: {format(data.stats.bestChickens)}</p>
            <p>Highest Egg Unlocked: {eggs[highestEgg].name}</p>
            <p>Time Played: {formatTime(data.stats.timePlayed)}</p>
        </div>
        {#if data.progression.unlockedContracts}
        <div class="flexCol statHolder green">
            <h3>Contract Stats</h3>
        </div>
        {/if}
        {#if data.progression.unlockedEggspeditions}
        <div class="flexCol statHolder blue">
            <h3>Eggspeditions Stats</h3>
        </div>
        {/if}
        {#if data.progression.hasPrestiged}
        <div class="flexCol statHolder purple">
            <h3>Prestige Stats</h3>
            <h4>Last 3 Prestiges</h4>
            {#each data.stats.last3Prestiges as item, i}
                <p>#{i+1} - <span class="purple">{format(item)} Soul Eggs</span></p>
            {/each}
            <p>Average Gain: <span class="purple">{format((data.stats.last3Prestiges[0].plus(data.stats.last3Prestiges[1]).plus(data.stats.last3Prestiges[2])).div(3))} Soul Eggs</span></p>
            <h4>Other Stats</h4>
            <p>Best Soul Eggs: <span class="purple">{format(data.stats.bestSoulEggs)}</span></p>
            <p>Time in Current Prestige: 1s</p>
        </div>
        {/if}
        {#if data.progression.hasAscended}
        <div class="flexCol statHolder orange">
            <h3>Ascension Stats</h3>
            <h4>Last 3 Ascensions</h4>
            {#each data.stats.last3Ascensions as item, i}
                <p>#{i+1} - <span class="yellow">{format(item)} Knowleggs</span></p>
            {/each}
            <p>Average Gain: <span class="yellow">{format((data.stats.last3Ascensions[0].plus(data.stats.last3Ascensions[1]).plus(data.stats.last3Ascensions[2])).div(3))} Knowleggs</span></p>
            <h4>Other Stats</h4>
            <p>Best Knowleggs: <span class="yellow">{format(data.stats.bestKnowleggs)}</span></p>
            <p>Time in Current Ascension: 1s</p>
        </div>
        {/if}
    </div>
{:else if subTab === 2}

{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;
    .statHolder {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 10px;
        margin-left: 0.25vw;
        margin-right: 0.25vw;
    }
    @each $name, $color in $majorColors {
        .#{$name} {
            border-color: $color;
            color: $color;
        }
    }
</style>
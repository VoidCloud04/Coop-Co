<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Chip from "$lib/components/Chip.svelte";
    import { contractGoalCurrencies, contractGoals, contracts, generateContract, gradeNames, gradeWalls, modifiers } from "$lib/scripts/ContractsManager";
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { eggs, regularEggImgIds } from "$lib/scripts/EggManager";
    import { format } from "$lib/scripts/Utilities";
    import { onMount } from "svelte";
    
    let gradeIndex = $derived(gameState.data.contracts.gradeIndex)
    let tabs = $state([
        {title: "Exchange", class: ""},
        {title: "Active", class: ""}
    ])
    let subTab = $state(0)
    function changeTab(i) {
        subTab =i
        if(subTab >= tabs.length)
            subTab = 0
    }

    const firstHalf = $derived(gameState.data.contracts.contractPool.slice(0,2))
    const secondHalf = $derived(gameState.data.contracts.contractPool.slice(2,4))

    const activeContract = $derived(gameState.data.indexValues.currentContract !== -1 ? gameState.data.contracts.contractPool[gameState.data.indexValues.currentContract] : null)

    
</script>


<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if subTab === 0}
    <div class="flexCol" style="align-items: center;">
        <div class="flexRow progress-row" style="align-items: center; align-self: center; gap: 0.25vw">
            <Chip content="USDE Class {gradeNames[gradeIndex]}" color={gradeNames[gradeIndex]}/>
            {#if gradeIndex < gradeNames.length - 1}
                <span
                    class="progress-bar"
                    style={`--progress: ${0}%; width: 25vw`}
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=10
                ></span>
            {/if}
            <p>{format(gameState.data.contracts.totalReputation)}/{format(gradeWalls[gradeIndex])} Reputation</p>
            {#if gradeIndex < gradeNames.length - 2 || (gradeIndex === gradeNames.length - 1 && gameState.data.research.legendaryResearch[1].gte(1))}
                <Chip content="USDE Class {gradeNames[gradeIndex+1]}" color={gradeNames[gradeIndex+1]}/>
            {/if}
        </div>
        <p>Prophecy Eggs: <span class="yellow">{format(gameState.data.currency.prophecyEggs)}</span> | <button class="button-red">Reroll on Cooldown</button></p>
    </div>
    <div class="flexRow">
        <div class="flexCol">
            {#each firstHalf as item, i}
                <div class="flexCol contract" class:locked={item !== null && item.grade > gradeIndex}>
                    {#if item === null}
                        <h3>No Contract Generated</h3>
                    {:else}
                        <div class="flexRow"> 
                        <Chip content={gradeNames[item.grade]} color={gradeNames[item.grade]}/>
                        <Chip content="{contractGoals[item.goal[0]]} Contract"/>
                        <Chip content="24h left"/>
                        {#if item.grade > gradeIndex}
                            <Chip content="Requires Grade {gradeNames[item.grade]}" color="red"/>
                        {/if}
                    </div>
                    <div class="flexRow">
                        <p>{contracts[item.contractIndex].name}</p>
                        <Chip imgSrc="Images/Eggs/{regularEggImgIds[contracts[item.contractIndex].eggIndex]}.png" content={eggs[contracts[item.contractIndex].eggIndex].name} />
                    </div>
                    <div class="flexRow">
                        {#each item.modifiers as debuff}
                            {#if modifiers[debuff[0]].type === "mul"}
                                <Chip content="*{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                            {:else if modifiers[debuff[0]].type === 'exp'}
                                <Chip content="^{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                            {:else if modifiers[debuff[0]].type === 'sub'}
                                <Chip content="-{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                            {/if}
                        {/each}
                    </div>
                    <p>Contract Goal: {format(item.goal[1])} {contractGoalCurrencies[item.goal[0]]}</p>
                    <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                    <p>Reputation Gain: {item.repGain == null ? "—" : format(item.repGain)}</p>
                    {#if item.grade > gradeIndex}
                        <button disabled>Locked — Grade {gradeNames[item.grade]} Required</button>
                    {:else}
                        <button>Start Contract</button>
                    {/if}
                    {/if}
                </div>
            {/each}
        </div>
        <div class="flexCol">
            {#each secondHalf as item, i}
                <div class="flexCol contract" class:locked={item !== null && item.grade > gradeIndex}>
                    {#if item === null}
                        <h3>No Contract Generated</h3>
                    {:else}
                        <div class="flexRow"> 
                        <Chip content={gradeNames[item.grade]} color={gradeNames[item.grade]}/>
                        <Chip content="Delivery Contract"/>
                        <Chip content="24h left"/>
                        {#if item.grade > gradeIndex}
                            <Chip content="Requires Grade {gradeNames[item.grade]}" color="red"/>
                        {/if}
                    </div>
                    <div class="flexRow">
                        <p>{contracts[item.contractIndex].name}</p>
                        <Chip imgSrc="Images/Eggs/{regularEggImgIds[contracts[item.contractIndex].eggIndex]}" content={eggs[contracts[item.contractIndex].eggIndex].name} />
                    </div>
                    <div class="flexRow">
                        {#each item.modifiers as modifier}
                            <Chip content="This is a debuff modifier" color="red" />
                        {/each}
                    </div>
                    <p>Contract Goal: $1.00e3</p>
                    <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                    <p>Reputation Gain: {item.repGain == null ? "—" : format(item.repGain)}</p>
                    {#if item.grade > gradeIndex}
                        <button disabled>Locked — Grade {gradeNames[item.grade]} Required</button>
                    {:else}
                        <button>Start Contract</button>
                    {/if}
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{:else if subTab === 1}
    {#if gameState.data.indexValues.currentContract != -1}
        <p>Active Contract</p>
        <div class="flexCol contract">
            <div class="flexRow"> 
                <Chip content={gradeNames[activeContract.grade]} color={gradeNames[activeContract.grade]}/>
                <Chip content="Delivery Contract"/>
            </div>
            <hr>
            <p>{contracts[activeContract.contractIndex].name}</p>
            <p>{contracts[activeContract.contractIndex].desc}</p>
            <hr>
            <div class="flexRow">
                <p>Egg:</p>
                <Chip imgSrc="Images/Eggs/{regularEggImgIds[contracts[activeContract.contractIndex].eggIndex]}.png" content={eggs[contracts[activeContract.contractIndex].eggIndex].name} />
            </div>
            <div class="flexRow">
                <p>Debuffs:</p>
                {#each activeContract.modifiers as debuff}
                    {#if modifiers[debuff[0]].type === "mul"}
                        <Chip content="*{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                    {:else if modifiers[debuff[0]].type === 'exp'}
                        <Chip content="^{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                    {:else if modifiers[debuff[0]].type === 'sub'}
                        <Chip content="-{format(modifiers[debuff[0]].debuffs[debuff[1]])} {modifiers[debuff[0]].name}" color="red" />
                    {/if}
                {/each}
                <Chip content="-0.25 Egg Value" color="red" />
                <Chip content="-0.25 Chicken Gain" color="red" />
                <Chip content="-0.25 Egg Value" color="red" />
            </div>
            <hr>
            <p>Contract Goal: $1.00e3</p>
            <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
            <button>Abandon Contract</button>
        </div>
    {:else}
        <h4>No Contract Active {":("}</h4>
    {/if}
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .contract {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 20px;
        margin-left: 0.25vw;
        margin-right: 0.25vw;
        max-width: 100%;
    }

    .contract.locked {
        opacity: 0.65;
    }

    .contract .flexRow {
        flex-wrap: wrap;
    }

    .contract button:disabled {
        cursor: not-allowed;
        white-space: normal;
    }

    div {
        align-items: left;
        align-self: left;
    }

    .yellow {
        color: $yellow
    }
</style>
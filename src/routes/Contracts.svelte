<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Chip from "$lib/components/Chip.svelte";

    let tabs = $state([
        {title: "Exchange", class: ""},
        {title: "Active", class: ""},
        {title: "Ledger", class: ""}
    ])
    let subTab = $state(0)
    function changeTab(i) {
        subTab =i
        if(subTab >= tabs.length)
            subTab = 0
    }
</script>


<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if subTab === 0}
    <div class="flexCol" style="align-items: center;">
        <div class="flexRow progress-row" style="align-items: center; align-self: center; gap: 0.25vw">
            <Chip content="USDE Class A" color={"A"}/>
            <span
                class="progress-bar"
                style={`--progress: 10%; width: 25vw`}
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=10
            ></span>
            <p>100/1,000 Reputation</p>
            <Chip content="USDE Class AA" color={"AA"}/>
        </div>
        <p>Prophecy Eggs: 0 | Reroll Available!</p>
    </div>
    <div class="flexRow">
        <div class="flexCol">
            <div class="flexCol contract">
                <div class="flexRow"> 
                    <Chip content="D" color="D"/>
                    <Chip content="Delivery Contract"/>
                    <Chip content="24h left"/>
                </div>
                <div class="flexRow">
                    <p>Supermarket Shortage</p>
                    <Chip imgSrc="Images/Eggs/egg.png" content="Regular" />
                </div>
                <div class="flexRow">
                    <Chip content="-0.25 Egg Value" color="red" />
                    <Chip content="-0.25 Chicken Gain" color="red" />
                    <Chip content="-0.25 Egg Value" color="red" />
                </div>
                <p>Contract Goal: $1.00e3</p>
                <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                <button>Start Contract</button>
            </div>
            <div class="flexCol contract">
                <div class="flexRow"> 
                    <Chip content="C" color="C"/>
                    <Chip content="Delivery Contract"/>
                    <Chip content="24h left"/>
                </div>
                <div class="flexRow">
                    <p>Supermarket Shortage</p>
                    <Chip imgSrc="Images/Eggs/egg.png" content="Regular" />
                </div>
                <div class="flexRow">
                    <Chip content="-0.25 Egg Value" color="red" />
                    <Chip content="-0.25 Chicken Gain" color="red" />
                    <Chip content="-0.25 Egg Value" color="red" />
                </div>
                <p>Contract Goal: $1.00e3</p>
                <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                <button>Start Contract</button>
            </div>
        </div>
        <div class="flexCol">
            <div class="flexCol contract">
                <div class="flexRow"> 
                    <Chip content="B" color="B"/>
                    <Chip content="Delivery Contract"/>
                    <Chip content="24h left"/>
                </div>
                <div class="flexRow">
                    <p>Supermarket Shortage</p>
                    <Chip imgSrc="Images/Eggs/egg.png" content="Regular" />
                </div>
                <div class="flexRow">
                    <Chip content="-0.25 Egg Value" color="red" />
                    <Chip content="-0.25 Chicken Gain" color="red" />
                    <Chip content="-0.25 Egg Value" color="red" />
                </div>
                <p>Contract Goal: $1.00e3</p>
                <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                <button>Start Contract</button>
            </div>
            <div class="flexCol contract">
                <div class="flexRow"> 
                    <Chip content="A" color="A"/>
                    <Chip content="Delivery Contract"/>
                    <Chip content="24h left"/>
                </div>
                <div class="flexRow">
                    <p>Supermarket Shortage</p>
                    <Chip imgSrc="Images/Eggs/egg.png" content="Regular" />
                </div>
                <div class="flexRow">
                    <Chip content="-0.25 Egg Value" color="red" />
                    <Chip content="-0.25 Chicken Gain" color="red" />
                    <Chip content="-0.25 Egg Value" color="red" />
                </div>
                <p>Contract Goal: $1.00e3</p>
                <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
                <button>Start Contract</button>
            </div>
        </div>
    </div>
{:else if subTab === 1}
    <p>Active Contract</p>
    <div class="flexCol contract">
        <div class="flexRow"> 
            <Chip content="D" color="D"/>
            <Chip content="Delivery Contract"/>
        </div>
        <hr>
        <p>Supermarket Shortage</p>
        <p>Mass egg buying has lead to increased prices, produce regular eggs to stabilize the economy</p>
        <hr>
        <div class="flexRow">
            <p>Egg:</p>
            <Chip imgSrc="Images/Eggs/egg.png" content="Regular" />
        </div>
        <div class="flexRow">
            <p>Debuffs:</p>
            <Chip content="-0.25 Egg Value" color="red" />
            <Chip content="-0.25 Chicken Gain" color="red" />
            <Chip content="-0.25 Egg Value" color="red" />
        </div>
        <hr>
        <p>Contract Goal: $1.00e3</p>
        <p>Stake: 3 Prophecy Eggs | Reward: 5 Prophecy Eggs</p>
        <button>Abandon Contract</button>
    </div>
{:else if subTab === 2}
    <p>Ledger</p>
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .contract {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 20px;
        margin-left: 0.25vw;
        margin-right: 0.25vw;
    }

    div {
        align-items: left;
        align-self: left;
    }
</style>
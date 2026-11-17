<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { planets } from "$lib/scripts/EggspeditionsManager";
    import Chip from "../Chip.svelte";
</script>

<h1>Arcturus Moment</h1>
<div class="flexCol">
    <div class="flexRow bordered">
        <Chip content="Dark Energy" imgSrc={planets[0].eggImgSrc} color="blue"/>
        <Chip content="Production Rate: +1.00/s" color="green" />
    </div>
    <div class="flexCol bordered">
        <h4>Generators</h4>
        <div class="flexRow">
            <div class="flexCol bordered">
                <p>Generator 1</p>
                <p>Power Output: 1.00 kW/s</p>
                <p>Burn Rate: 1.00 Dark Energy Eggs/s</p>
                <p>Upgrade Cost: $1.00</p>
                <p>Maintenance Cost: $1.00/s</p>
            </div>
            <div>
                Generator 2
            </div>
            <div>
                Generator 3
            </div>
        </div>
        
    </div>
    <div class="flexRow bordered">
        <Chip content="Output: 1.00 MW/s" color="yellow" />
        <Chip content="Cash Flow: 1.00e3/s" color="green" />
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .bordered {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
    }
    
    .flexCol {
        align-items: center;
    }

    div {
        padding: 5px;
    }
</style>
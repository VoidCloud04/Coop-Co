<script>

</script>

<div>
    <img src="/Images/Gilded.png" alt="Your Current Egg">
    <button id="promotion-button" class="button-header">Promote to Next Egg!</button>
    <h2>1000 $</h2>
    <p>Chickens: 1000</p>
    <button id="prestige-button" class="button-purple-header">Prestige</button>
    <button id="ascension-button" class="button-orange-header">Ascend</button>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        background-color: $header-color;
        color: black;
        width: 100%;
        padding-top: 0.5vh;
        padding-bottom: 0.5vh;
        * {
            color: inherit;
            background-color: inherit;
            margin-left: 0.25vw;
            margin-right: 0.25vw;
            margin-top: 0.5vh;
            margin-bottom: 0.5vh;
        }
    }



</style>
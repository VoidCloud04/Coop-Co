<script>

</script>

<div>
    <img src="/Images/Gilded.png" alt="Your Current Egg">
    <button id="promotionButton">Promote to Next Egg!</button>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    
    div {
        display: flex;
        flex-direction: row;
        background-color: $header-color;
        color: black;
        width: 100%;
    }

    button {
        border-color: black;
        color: inherit;
        background-color: inhert;

        &:hover {
            background-color: black;
            color: $header-color;
        }
    }

    img {
        background-color: inherit;
    }

</style>
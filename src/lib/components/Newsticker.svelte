<script>

</script>

<div id="news-holder">
    <div id="news">

    </div>
</div>

<style lang="scss">
    @use "$lib/styles/variables" as *;
    #news-holder {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 2px;
        width: 45%;
        text-align: left; 
        overflow: hidden;
    }
    #news {
        display: inline-block;
        white-space: nowrap;
        font-size: 15px;
    }
</style>
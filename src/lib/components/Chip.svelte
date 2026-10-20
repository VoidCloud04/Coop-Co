<script>
    let {content, imgSrc = '', color = 'gray'} = $props()
</script>

<div class=".badge-{color}">
    {#if imgSrc !== ''} 
        <img src={imgSrc} alt={imgSrc}>
        {content}
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;



    @each $name, $color in $majorColors {
        .badge-#{$name} {
            background-color: $color;
            color: $white;
            padding: 2px 4px;
            border-radius: $borderRadius;
            text-align: center;
            margin-left: 0.25vw;
            margin-right: 0.25vw;
        }
    }
</style>
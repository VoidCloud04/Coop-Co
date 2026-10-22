<script>
    let {content, imgSrc = '', color = 'gray'} = $props()
    
</script>

<div class="badge-{color}">
    {#if imgSrc !== ''} 
        <img src={imgSrc} alt={imgSrc}>
    {/if}
    {content}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    img {
        height: 1.5em;
        width: 1.5em;
        background-color: inherit;
    }

    @each $name, $color in $majorColors {
        .badge-#{$name} {
            display: inline-flex;
            align-items: center;
            background-color: $color;
            color: $white;
            padding: 2px 4px;
            border-radius: $borderRadius;
            text-align: center;
            margin-left: 0.25vw;
            margin-right: 0.25vw;
        }
    }
    @each $name, $color in $ratings {
        .badge-#{$name} {
            display: inline-flex;
            align-items: center;
            background-color: $color;
            color: $white;
            padding: 2px 4px;
            border-radius: $borderRadius;
            text-align: center;
            margin-left: 0.25vw;
            margin-right: 0.25vw;
        }
    }

    .badge-yellow, .badge-green, .badge-C, .badge-B, .badge-A, .badge-AA, .badge-AAA {
        color: $bg-color;
    }
</style>
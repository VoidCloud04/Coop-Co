<script>
    import { onMount, tick } from 'svelte'
    import { newsText, pickNewsMessage } from '$lib/scripts/NewstickerManager'

    const scrollSpeed = 100 // pixels per second
    const startDelay = 100 // milliseconds, matching legacy
    const edgePadding = 20

    let holderEl = $state(null)
    let textEl = $state(null)
    let message = $state('')
    let href = $state('')

    let frameId = null
    let stopped = false
    let paused = false
    let runStart = 0
    let elapsed = 0
    let duration = 0
    let startX = 0
    let endX = 0

    function setX(x) {
        if (textEl) textEl.style.transform = `translateX(${x}px)`
    }

    function frame(now) {
        if (stopped || paused || duration <= 0) return

        const t = elapsed + (now - runStart)

        if (t < startDelay) {
            setX(startX)
        } else {
            const progress = Math.min((t - startDelay) / duration, 1)
            setX(startX + (endX - startX) * progress)

            if (progress >= 1) {
                frameId = null
                showNext()
                return
            }
        }

        frameId = requestAnimationFrame(frame)
    }

    function stopFrames() {
        if (frameId !== null) {
            cancelAnimationFrame(frameId)
            frameId = null
        }
    }

    async function showNext() {
        const item = pickNewsMessage()
        if (!item) return

        stopFrames()
        paused = false
        elapsed = 0

        message = newsText(item)
        href = item.href ?? ''

        // Wait for Svelte to render the new text before measuring it.
        await tick()

        if (stopped || !holderEl || !textEl) return

        item.action?.()

        startX = holderEl.clientWidth
        endX = -(textEl.clientWidth + 5)
        const distance = holderEl.clientWidth + textEl.clientWidth + edgePadding
        duration = (distance / scrollSpeed) * 1000

        // Start just outside the right edge, exactly like the legacy ticker.
        setX(startX)
        runStart = performance.now()

        if (document.hidden) {
            paused = true
            return
        }

        frameId = requestAnimationFrame(frame)
    }

    function handleVisibility() {
        if (stopped || duration <= 0) return

        if (document.hidden) {
            if (!paused) {
                paused = true
                elapsed += performance.now() - runStart
                stopFrames()
            }
        } else if (paused) {
            paused = false
            runStart = performance.now()
            frameId = requestAnimationFrame(frame)
        }
    }

    onMount(() => {
        showNext()
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            stopped = true
            stopFrames()
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    })
</script>

<div id="news-holder" bind:this={holderEl}>
    <div id="news" bind:this={textEl}>
        {#if href}
            <a {href} target="_blank" rel="noopener noreferrer">{message}</a>
        {:else}
            {message}
        {/if}
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    #news-holder {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 2px;
        width: 45%;
        text-align: left;
        overflow: hidden;
    }

    #news {
        color: whitesmoke;
        position: relative;
        display: inline-block;
        white-space: nowrap;
        font-size: 15px;
        font-family: inherit;
        font-weight: bold;
        background-color: transparent;
    }

    #news a {
        color: inherit;
        white-space: nowrap;
        text-decoration: underline;
        background-color: transparent;
    }
</style>

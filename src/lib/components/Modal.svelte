<script>
    import { closeModal, modalState } from '$lib/scripts/ModalManager.svelte'

    let inputValue = $state('')
    let inputEl = $state(null)

    $effect(() => {
        if (!modalState.open || modalState.type !== 'prompt') return

        inputValue = modalState.value
        inputEl?.focus()
    })

    function accept() {
        closeModal(modalState.type === 'prompt' ? inputValue : true)
    }

    function cancel() {
        closeModal(modalState.type === 'prompt' ? null : false)
    }

    function handleKeydown(event) {
        if (!modalState.open) return

        // Let a focused button handle Enter itself.
        if (event.target instanceof HTMLButtonElement) return

        if (event.key === 'Escape') cancel()
        if (event.key === 'Enter') accept()
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if modalState.open}
    <div
        class="modal-container modal-{modalState.color}"
        role="dialog"
        aria-label={modalState.title}
    >
        <h3>{modalState.title}</h3>

        {#if modalState.content}
            <p>{modalState.content}</p>
        {/if}

        {#if modalState.type === 'prompt'}
            <input bind:this={inputEl} bind:value={inputValue} placeholder={modalState.placeholder}>
        {/if}

        <div class="flexRow modal-actions">
            {#if modalState.type !== 'alert'}
                <button class="button-red" onclick={cancel}>{modalState.cancelText}</button>
            {/if}
            <button class="button-green" onclick={accept}>{modalState.confirmText}</button>
        </div>
    </div>
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .modal-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 6969;
        min-width: 20em;
        max-width: 40em;
        padding: 10px;
        border: 4px solid $white;
        border-radius: $borderRadius;
        background-color: $bg-color;
        text-align: center;
    }

    .modal-actions {
        justify-content: center;
        margin-top: 0.5em;
    }

    input {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        color: $white;
        background-color: $bg-color;
        font-family: 'Martian Mono';
        padding: 2px 4px;
        margin-top: 0.5em;
    }

    @each $name, $color in $majorColors {
        .modal-#{$name} {
            border-color: $color;
        }
    }
</style>

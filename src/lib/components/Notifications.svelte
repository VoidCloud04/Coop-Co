<script>
    import { notifications } from '$lib/scripts/NotificationManager.svelte'
</script>

<div id="notification-holder">
    {#each notifications as notification (notification.id)}
        <p class="notification-{notification.type}">{notification.text}</p>
    {/each}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    #notification-holder {
        position: fixed;
        top: 0;
        right: 0;
        margin: 0.5em;
        z-index: 7000;
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        width: fit-content;
        max-width: 40em;
        background-color: transparent;
    }

    .notification-info {
        background-color: $blue;
        border: 5px solid #1f539b;
        border-radius: $borderRadius;
        color: $bg-color;
        padding: 0.25em;
        text-align: center;
    }

    .notification-success {
        background-color: $green;
        border: 5px solid #1f9b3a;
        border-radius: $borderRadius;
        color: $bg-color;
        padding: 0.25em;
        text-align: center;
    }

    .notification-warn {
        background-color: $yellow;
        border: 5px solid #9b991f;
        border-radius: $borderRadius;
        color: $bg-color;
        padding: 0.25em;
        text-align: center;
    }

    .notification-error {
        background-color: $red;
        border: 5px solid #9b1f1f;
        border-radius: $borderRadius;
        color: $bg-color;
        padding: 0.25em;
        text-align: center;
    }
</style>

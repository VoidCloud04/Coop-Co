<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { commonResearch } from "$lib/scripts/ResearchManager";

    let tiers = $derived.by(() => {
        const ret = new Map()

    })
</script>

<h3>Research Center</h3>
<table>
    <thead>
        <tr>
            <th>Research Tier</th>
            <th>Researches</th>
        </tr>
    </thead>

    <tbody>
        {#each commonResearch as item, i}
            <tr>
                <td>
                    <p>Tier {i / 2 + 1}</p>
                </td>
                <td>
                    <button>Upgrade 1</button>
                    <button>Upgrade 2</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">

</style>
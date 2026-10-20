<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { commonByTier, commonResearch } from "$lib/scripts/ResearchManager";

    let tiers = commonByTier()
    console.log(tiers)
    function toRN(num) {
        const values = [
            {
                value: 1,
                numeral: "I"
            },
            {
                value: 4,
                numeral: "IV"
            },
            {
                value: 5,
                numeral: "V"
            },
            {
                value: 9,
                numeral: "IX"
            },
            {
                value: 10,
                numeral: "X"
            }
        ]
        let ret = ""
        for(let i = values.length - 1; i >= 0; i--) {
            while(num >= values[i].value) {
                ret += values[i].numeral
                num -= values[i].value
            }
        }
        return ret
    }
</script>

<h3>Research Center</h3>
<!-- <table>
    <thead>
        <tr style="border-right: 2px solid whitesmoke">
            <th>Research Tier</th>
            <th>Researches</th>
        </tr>
    </thead>

    <tbody>
        {#each tiers as items, i}
            <tr>
                <td>
                    <p>Tier {toRN(i+1)}</p>
                </td>
                <td>
                    {#each items as item, j}
                        <button>{item.title}<br>{`Level: 0/0`}<br>{`Cost: MAXED`}</button>
                    {/each}
                </td>
            </tr>
        {/each}
    </tbody>
</table> -->
<div class="tier-grid">
    <div class="heading">Tier</div>
    <div class="heading">Researches</div>

    {#each tiers as items, i}
        <div class="tier-label">Tier {toRN(i + 1)}</div>
        <div class="researches">
            {#each items as item}
                <button>{item.title}+{item.desc}<br>{"Level: 0/0"}</button>
            {/each}
        </div>
    {/each}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    .tier-grid {
        display: grid;
        grid-template-columns: 8rem minmax(0, 1fr);
        gap: 0.5rem 1rem;
        align-items: start;
    }

    .heading {
        font-weight: bold;
        border-bottom: 2px solid $white;
    }

    .tier-label,
    .researches {
        padding-block: 0.25rem;
    }

    .researches {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

</style>
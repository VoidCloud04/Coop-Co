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
<table>
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
</table>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    table {
        border: $borderWidth solid $white;
        padding: 5px; 
        text-align: justify;
        border-collapse: collapse;
    }
    th,td {
        border: $borderWidth solid $white;
        padding: 0.5em;
        button {
            margin-left: 0.25vw;
            margin-right: 0.25vw;
        }
    }
    tr:nth-child(even) {
        background-color: $blue;
    }
</style>
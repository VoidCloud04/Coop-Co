<script>
	const changelog = [
		{
			version: "v2.0.3",
			date: "2026-01-12",
			type: "bugfix",
			title: "Bug Fix",
			changes: "Fix missing fonts, transfer Coop Co over to new domain name"
		},
		{
			version: "v2.0.2",
			date: "2023-12-23",
			type: "minor",
			title: "Minor Update",
			changes: "Contributor Update: Responsive CSS makes the game easily playable on mobile devices"
		},
		{
			version: "v2.0.1",
			date: "2023-12-16",
			type: "minor",
			title: "Minor Update",
			changes: "Added a Artifact Collection Boost, Squashed 2.0 Bugs both gameplay and display bugs, added some new achievements"
		},
		{
			version: "v2.0.0",
			date: "2023-12-15",
			type: "major",
			title: "Major Update",
			changes: "Enlightenment Removal, UI Overhaul, Code Refactoring, Bug Squashing, Rebalancing, More Achievements, Removed Multi Theme, More QoL features."
		},
		{
			version: "v1.1.5",
			date: "2022-07-06",
			type: "minor",
			title: "Minor Update",
			changes: "Cleaned up Styling and removed almost all inline styling, Added Multi-Theme support (3 Themes Currently: Original, Void Stream (my take on the Star Stream theme in NG+3C) and Flashbang) and Changed the progress bar to be yellow is progress to discovery and green is unlock progress"
		},
		{
			version: "v1.1.4",
			date: "2022-06-29",
			type: "rebalance",
			title: "Major Rebalance",
			changes: "Massive Prophecy Egg Boost Softcap, All End Game Saves reset to a default End Game Save due to rebalance, Contract Rebalance Part 6 (ono), Enlightenment Buy Amount Implemented, Prestige based off of best money on the current egg, Auto Promotion Stop Toggle and Prevent Entering contracts while being enlightened."
		},
		{
			version: "v1.1.3",
			date: "2022-06-21",
			type: "rebalance",
			title: "Rebalance",
			changes: "New Planet Boost (Knowledge Gain), Knowledge and Enlightenment Rebalance, Achievement 38-41 Rebalance, Next Egg Not Being Hidden Fixed"
		},
		{
			version: "v1.1.2",
			date: "2022-06-21",
			type: "bugfix",
			title: "Bug Fix",
			changes: "Quick Patch for Eggspedition Button being missing"
		},
		{
			version: "v1.1.1",
			date: "2022-06-20",
			type: "bugfix",
			title: "Bug Fix & Rebalance",
			changes: "Eggspedition Discovery Rebalance, Contract Notification Toggle, Warning for eggspeditions"
		},
		{
			version: "v1.1.0",
			date: "2022-06-20",
			type: "major",
			title: "Major Update",
			changes: "Enlightenments, Eggpeditions, Notifications via Notify.js, Tier XI-XIV Auto, Error NAN Display Fix, New Formatter, Auto Save is 30s Interval Now (Originally 10s), Stats Screen, Achievements"
		},
		{
			version: "v1.0.11",
			date: "2022-05-27",
			type: "rebalance",
			title: "Rebalance",
			changes: "Contract Rebalance pt 5 (I'm probably going to stop rebalancing now)"
		},
		{
			version: "v1.0.10",
			date: "2022-05-27",
			type: "bugfix",
			title: "Bug Fix & Rebalance",
			changes: "More 1.0.3 Fixes, New Prophecy Egg Boost and Contract Rebalance pt 4 (finale?)"
		},
		{
			version: "v1.0.9",
			date: "2022-05-27",
			type: "bugfix",
			title: "Bug Fix",
			changes: "More Fixes for bugs introduced by 1.0.3"
		},
		{
			version: "v1.0.8",
			date: "2022-05-27",
			type: "major",
			title: "Major Update",
			changes: "New Formatter (by Dimava), Optimized Common Research Buyer and Optimized Prophecy Egg Reward (by Gazyn)"
		},
		{
			version: "v1.0.7",
			date: "2022-05-26",
			type: "rebalance",
			title: "Rebalance",
			changes: "Contract Rebalance Part 3 | Soul Egg Rewards Removed Entirely from Contracts"
		},
		{
			version: "v1.0.6",
			date: "2022-05-26",
			type: "bugfix",
			title: "Bug Fix",
			changes: "Fully Working Double Progress Bar (by Dimava)"
		},
		{
			version: "v1.0.5",
			date: "2022-05-26",
			type: "bugfix",
			title: "Bug Fix",
			changes: "Fix Major Bug Introduced in 1.0.3"
		},
		{
			version: "v1.0.4",
			date: "2022-05-26",
			type: "minor",
			title: "Minor Update",
			changes: "Newsticker Added In Game"
		},
		{
			version: "v1.0.3",
			date: "2022-05-26",
			type: "major",
			title: "Major Update",
			changes: "Egg Promotion Progress Bar, Egg Promotion and Prestige Buttons Hidden When In Contract, and Slightly Better Code (by gapples2)"
		},
		{
			version: "v1.0.2",
			date: "2022-05-25",
			type: "rebalance",
			title: "Rebalance",
			changes: "Contract Rebalancing Part 2, Delete Save Confirmation"
		},
		{
			version: "v1.0.1",
			date: "2022-05-25",
			type: "minor",
			title: "Minor Update",
			changes: "Minor Bug Fixes, 2 New Epic Researches, Favicon changes based on current egg, and Contract Rebalancing Part 1"
		},
		{
			version: "v1.0.0",
			date: "2022-05-25",
			type: "bugfix",
			title: "Bug Fix",
			changes: "Patching and Polishing"
		},
		{
			version: "v0.0.3",
			date: "2022-05-24",
			type: "major",
			title: "Major Update",
			changes: "Contracts, Automation and Internal Hatchery Buff"
		},
		{
			version: "v0.0.2",
			date: "2022-05-24",
			type: "major",
			title: "Major Update",
			changes: "Prestige!"
		},
		{
			version: "v0.0.1",
			date: "2022-05-23",
			type: "major",
			title: "Major Update",
			changes: "All Eggs, 28 \"Common\" Researches, Egg Promotion System"
		}
	]
</script>

<h1>Changlog :O</h1>
<div class="flexCol" style="align-items: left; padding: 10px">
	{#each changelog as log, i}
		<div class="flexRow">
			<h2>{log.version}</h2>
			<h2 class="{log.type === "major" ? 'badge-green' : ''}{log.type === "minor" ? 'badge-blue' : ''}{log.type === "rebalance" ? 'badge-red' : ''}{log.type === "bugfix" ? 'badge-yellow' : ''}">{log.title}</h2>
			<h2>{log.date}</h2>
		</div>
		<p>{log.changes}</p>
	{/each}
</div>


<style lang="scss">
	@use '$lib/styles/variables'  as *;
	p {
		text-align: left;
	}
	.badge-red {
        background-color: $red;
        color: $white;
        padding: 2px 4px;
        border-radius: $borderRadius;
        text-align: center;
        margin-left: 1vw;
        margin-right: 1vw;
    }
    
    .badge-green {
        background-color: $green;
        color: $white;
        padding: 2px 4px;
        border-radius: $borderRadius;
        text-align: center;
        margin-left: 1vw;
        margin-right: 1vw;
    }
    
    .badge-blue {
        background-color: $blue;
        color: $white;
        padding: 2px 4px;
        border-radius: $borderRadius;
        text-align: center;
        margin-left: 1vw;
        margin-right: 1vw;
    }
    
    .badge-yellow {
        background-color: $yellow;
        color: $bg-color;
        padding: 2px 4px;
        border-radius: $borderRadius;
        text-align: center;
        margin-left: 1vw;
        margin-right: 1vw;
    }
</style>
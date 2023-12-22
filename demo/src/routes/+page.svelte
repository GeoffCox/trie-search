<script lang="ts">
	import '@geoffcox/sterling-svelte/css/sterling.css';
	import { onMount } from 'svelte';
	import TrieSearchStringPanel from './TrieSearchStringPanel.svelte';

	let mounted = false;

	onMount(() => (mounted = true));
</script>

<div class="root light-mode">
	<div class="header">@geoffcox/trie-search</div>
	<div class="introduction">
		This demonstrates this Trie search using the US constitution. All occurances of of multiple
		words or phrases are found with a single pass over the text.
	</div>
	{#if mounted}
		<div class="search">
			<TrieSearchStringPanel />
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
	}

	.root {
		display: flex;
		flex-direction: column;
		row-gap: 1em;
	}

	.header {
		background-color: #222;
		color: #ddd;
		font-size: 1.6em;
		padding: 0.25em;
	}

	.introduction {
		line-height: 1.6em;
		max-width: 550px;
		padding: 1em;
		align-self: center;
	}

	.search {
		padding: 0 2em 4em 2em;
	}
</style>

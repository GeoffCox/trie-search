<script lang="ts">
	import '@geoffcox/sterling-svelte/css/sterling.css';
	import { onMount } from 'svelte';
	import TrieSearchStringPanel from './TrieSearchStringPanel.svelte';

	let mounted = false;

	onMount(() => (mounted = true));
</script>

<div class="root light-mode">
	{#if mounted}
			<TrieSearchStringPanel />
	{/if}
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		row-gap: 1em;
	}
</style>

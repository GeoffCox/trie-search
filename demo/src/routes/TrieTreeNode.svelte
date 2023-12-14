<script lang="ts">
	import type { TrieDisplayNode } from 'trie-search';

	export let node: TrieDisplayNode<string>;
</script>

<div class="node">
	<div class="item">{node.value}</div>
	<div class="children">
		{#if node.children}
			{#each node.children as child}
				<svelte:self node={child} />
			{/each}
		{/if}
	</div>
</div>

<style>
    .node {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        justify-content: stretch;
        justify-items: stretch;
        align-items: center;
        row-gap: 0.5em;
    }

    .item {
        border: 1px solid black;
        padding: 0.5em;
        align-self: center;
        justify-self: center;
        border-top-left-radius: 25%;
        border-top-right-radius: 25%;
        border-bottom-left-radius: 25%;
        border-bottom-right-radius: 25%;
        text-align: center;
        vertical-align: middle;
    }

    .children {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        justify-items: stretch;
        align-items: flex-start;
        column-gap: 1em;

    }
</style>

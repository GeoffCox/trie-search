<script lang="ts">
	import { createTrieDisplayTree, type TrieNode } from 'trie-search';
	import TrieTreeNode from './TrieTreeNode.svelte';

	export let node: TrieNode<string>;

	$: treeNode = createTrieDisplayTree('^', node);
</script>

<div class="root">
<TrieTreeNode node={treeNode} />
</div>

<style>
    .root {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
        justify-content: flex-start;
        justify-items: flex-start;
    }
</style>
<script lang="ts">
	import { countBy } from 'lodash-es';
	import { Button, Input, Label, Switch, Tab, TabList } from '@geoffcox/sterling-svelte';
	import {
		trieSearchString,
		type TrieSearchFoundRange,
		type TrieNode,
		addToTrieNode,
		trieSearchWords,
		createWordIterator,
		createCharacterIterator
	} from 'trie-search';
	import { constitution } from '../constitution';
	import SearchBadge from './SearchBadge.svelte';
	import TrieTree from './TrieTree.svelte';
	import SearchResults from './SearchResults.svelte';

	// ----- Props ----- //

	let searchText1 = '';
	let searchText2 = '';
	let searchText3 = '';
	let searchText4 = '';
	let searchText5 = '';

	let searchNode: TrieNode<string> = {};
	let searchActive = false;
	let searchResults: TrieSearchFoundRange[] = [];
	let resultCounts: Record<number, number> = {};
	let resultWordByWord = false;

	let caseSensitive = false;
	let wordByWord = false;
	let selectedTab = 'results';

	$: {
		searchText1, searchText2, searchText3, searchText4, searchText5;
		searchActive = false;
		resultCounts = {};
	}

	const runSearch = () => {
		const searchFor = [searchText1, searchText2, searchText3, searchText4, searchText5].filter(
			Boolean
		);

		searchNode = {};
		searchFor.forEach((sf) => {
			const iterator = wordByWord ? createWordIterator(sf) : createCharacterIterator(sf);
			addToTrieNode(iterator, searchNode);
		});

		if (wordByWord) {
			searchResults = trieSearchWords(
				constitution,
				{
					caseInsensitive: !caseSensitive
				},
				...searchFor
			);
		} else {
			searchResults = trieSearchString(
				constitution,
				{
					caseInsensitive: !caseSensitive
				},
				...searchFor
			);
		}

		resultWordByWord = wordByWord;
		resultCounts = countBy(searchResults, 'searchIndex');

		searchActive = true;
	};

	const clearSearch = () => {
		searchText1 = '';
		searchText2 = '';
		searchText3 = '';
		searchText4 = '';
		searchText5 = '';

		searchNode = {};
		searchResults = [];
		resultCounts = {};
		searchActive = false;
	};
</script>

<div class="root">
	<div class="search-inputs">
		<Label text="search phrases" />
		<div />
		<Input bind:value={searchText1} /><SearchBadge
			searchIndex={0}
			count={resultCounts[0] || (searchText1 && searchActive ? 0 : undefined)}
		/>
		<Input bind:value={searchText2} /><SearchBadge
			searchIndex={1}
			count={resultCounts[1] || (searchText2 && searchActive ? 0 : undefined)}
		/>
		<Input bind:value={searchText3} /><SearchBadge
			searchIndex={2}
			count={resultCounts[2] || (searchText3 && searchActive ? 0 : undefined)}
		/>
		<Input bind:value={searchText4} /><SearchBadge
			searchIndex={3}
			count={resultCounts[3] || (searchText4 && searchActive ? 0 : undefined)}
		/>
		<Input bind:value={searchText5} /><SearchBadge
			searchIndex={4}
			count={resultCounts[4] || (searchText5 && searchActive ? 0 : undefined)}
		/>
	</div>
	<div class="search-options">
		<Label text="options" forwardClick={false} variant="boxed" for="nothing">
			<div class="search-option-items">
				<Switch onText="case-sensitive" bind:checked={caseSensitive} />
				<Switch onText="word-by-word" bind:checked={wordByWord} />
			</div>
		</Label>
	</div>
	<div class="search-actions">
		<Button variant="secondary" on:click={clearSearch}>Clear</Button>
		<Button on:click={runSearch}>Search</Button>
	</div>
	<div class="search-result-tabs">
		<TabList bind:selectedValue={selectedTab}>
			<Tab value="results">Search Results</Tab>
			<Tab value="searchTree">Search Tree</Tab>
		</TabList>
	</div>
	{#if selectedTab === 'results'}
		<div class="search-results">
			<SearchResults text={constitution} results={searchResults} wordByWord={resultWordByWord} />
		</div>
	{:else if selectedTab === 'searchTree'}
		<div class="search-tree">
			<TrieTree node={searchNode} />
		</div>
	{/if}
</div>

<style>
	.root {
		display: grid;
		grid-template-columns: auto auto 1fr;
		grid-template-rows: auto auto auto auto auto;
		grid-template-areas: '. . tabs' 'inputs options results' 'inputs actions results' '. . results';
		column-gap: 1em;
		row-gap: 1em;
		align-items: flex-start;
	}

	.search-inputs {
		display: grid;
		grid-area: inputs;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto auto auto auto;
		row-gap: 1em;
		column-gap: 1em;
		align-items: center;
	}

	.search-options {
		align-self: flex-end;
		grid-area: options;
		justify-self: stretch;
		display: grid;
		row-gap: 0.25em;
	}

	.search-actions {
		align-self: flex-start;
		display: grid;
		grid-area: actions;
		grid-template-columns: auto auto;
		justify-self: center;
		margin-bottom: 2em;
		column-gap: 1em;
	}

	.search-option-items {
		grid-area: options;
		justify-self: flex-start;
		font-size: 0.8em;
		display: grid;
		row-gap: 0.25em;
		padding: 1em;
	}

	.search-result-tabs {
		grid-area: tabs;
	}

	.search-results {
		grid-area: results;
		border: 1px solid gray;
		padding: 1em;
		max-height: 500px;
		overflow: hidden;
		overflow-y: scroll;
		overscroll-behavior: contain;
	}

	.search-tree {
		display: grid;
		justify-content: center;
		grid-area: results;
		border: 1px solid gray;
		padding: 1em;
		max-height: 500px;
		overflow: hidden;
		overflow-y: scroll;
		overscroll-behavior: contain;
	}

	@media only screen and (max-width: 900px) {
		.root {
			grid-template-columns: auto;
			grid-template-rows: auto;
			grid-template-areas: 'inputs' 'options' 'actions' 'tabs' 'results';
			align-items: flex-start;
		}

		.search-options {
			justify-self: center;
		}

		.search-results, .search-tree {
			overflow-y: hidden;
			max-height: unset;
			max-width: unset;
			overscroll-behavior: unset;
		}
	}
</style>

<script lang="ts">
	import { countBy, groupBy, orderBy, sortBy } from 'lodash-es';
	import { Button, Input, Switch } from '@geoffcox/sterling-svelte';
	import {
		trieSearchString,
		type TrieSearchFoundRange,
		type TrieNode,
		addToTrieNode,
		trieSearchWords
	} from 'trie-search';
	import { constitution as rawConstitution } from '../constitution';
	import SearchBadge from './SearchBadge.svelte';

	// ----- Types ----- //

	type FormattedSearchResult = {
		value: string;
		isMatch: boolean;
		inRange: boolean;
		searchForIndex: number;
	};

	// ----- Constants ----- //

	const constitution = rawConstitution.replaceAll('\n', '');

	const stringSearchForColors = [
		'steelblue',
		'seagreen',
		'darksalmon',
		'darkgoldenrod',
		'mediumpurple',
		'indianred',
		'thistle',
		'palegoldenrod',
		'silver'
	];

	const emptyStringSearchResults: FormattedSearchResult[] = [
		{
			value: constitution,
			isMatch: false,
			inRange: false,
			searchForIndex: -1
		}
	];

	// ----- Helpers ----- //

	const formatResults = (text: string, ranges: TrieSearchFoundRange[]): FormattedSearchResult[] => {
		if (ranges.length === 0) {
			return [
				{
					value: text,
					isMatch: false,
					inRange: false,
					searchForIndex: -1
				}
			];
		}

		const byStart = groupBy(ranges, 'start');
		const byEnd = groupBy(ranges, 'end');

		let results: FormattedSearchResult[] = [];
		let inRange: number[] = [];
		let current: string = '';
		for (let i = 0; i < text.length; i++) {
			const starts = byStart[i];
			const ends = byEnd[i];

			if (!starts && !ends) {
				current += text[i];
				continue;
			} else if (current.length > 0) {
				results.push({
					value: current,
					isMatch: false,
					inRange: inRange.length > 0,
					searchForIndex: -1
				});
				current = '';
			}

			if (starts) {
				const sortedStarts = sortBy(starts, 'end');
				sortedStarts.forEach((start) => {
					results.push({
						value: '[',
						isMatch: true,
						inRange: false,
						searchForIndex: start.searchIndex
					});
					inRange.push(start.searchIndex);
				});
			}

			if (ends) {
				const sortedEnds = orderBy(ends, ['start', 'desc']);
				sortedEnds.forEach((end) => {
					results.push({
						value: ']',
						isMatch: true,
						inRange: false,
						searchForIndex: end.searchIndex
					});
					const leaveRange = inRange.lastIndexOf(end.searchIndex);
					if (leaveRange !== -1) {
						inRange.splice(leaveRange, 1);
					}
				});
			}

			results.push({
				value: text[i],
				isMatch: false,
				inRange: inRange.length > 0,
				searchForIndex: -1
			});
		}

		if (current.length > 0) {
			results.push({
				value: current,
				isMatch: false,
				inRange: inRange.length > 0,
				searchForIndex: -1
			});
			current = '';
		}

		return results;
	};

	// ----- Props ----- //

	let searchText1 = '';
	let searchText2 = '';
	let searchText3 = '';
	let searchText4 = '';
	let searchText5 = '';

	let caseInsensitive = false;
	let words = false;
	let searchResults: TrieSearchFoundRange[] = [];

	$: searchFor = [searchText1, searchText2, searchText3, searchText4, searchText5].filter(Boolean);
	$: stringSearchResults = formatResults(constitution, searchResults);

	$: resultCounts = countBy(searchResults, 'searchForIndex');

	$: console.log(resultCounts);

	let searchNode: TrieNode<string> = {};

	const createSearchNode = (searchFor: string[]) => {
		searchNode = {};
		searchFor.forEach((sf) => addToTrieNode(sf[Symbol.iterator](), searchNode));
	};

	$: createSearchNode(searchFor);

	const onStringSearch = () => {
		if (words) {
			searchResults = trieSearchWords(constitution, { caseInsensitive }, ...searchFor);
		} else {
			searchResults = trieSearchString(constitution, { caseInsensitive }, ...searchFor);
		}
	};

	const onStringSearchClear = () => {
		stringSearchResults = emptyStringSearchResults;
	};
</script>

<div class="root">
	<div class="header">
		<p>
			This demonstrates calling trieSearchString. Type one or more search phrases into the Search
			For field, then click the Search button.
		</p>
		<code
			>trieSearchString(text: string, options: &lbrace; caseInsensitive?: boolean &rbrace;
			...searchFor: string[]) : TrieSearchResult[]</code
		>
	</div>
	<div class="search">
		<div class="search-inputs">
			<Input bind:value={searchText1} /><SearchBadge searchIndex={0} count={resultCounts[0]} />
			<Input bind:value={searchText2} /><SearchBadge searchIndex={1} count={resultCounts[1]} />
			<Input bind:value={searchText3} /><SearchBadge searchIndex={2} count={resultCounts[2]} />
			<Input bind:value={searchText4} /><SearchBadge searchIndex={3} count={resultCounts[3]} />
			<Input bind:value={searchText5} /><SearchBadge searchIndex={4} count={resultCounts[4]} />
		</div>
		<div class="actions">
			<Button on:click={onStringSearch}>Search</Button>
			<Button on:click={onStringSearchClear}>Clear</Button>
			<Switch onText="Case insensitive" bind:checked={caseInsensitive} variant="colorful" />
			<Switch onText="Word-by-word" bind:checked={words} variant="colorful" />
		</div>
		<div></div>
	</div>

	<div class="results">
		{#each stringSearchResults as result}
			<span
				class="result"
				class:match={result.isMatch}
				class:in-range={result.inRange}
				style={`--search-for-color: ${
					stringSearchForColors[result.searchForIndex] || 'lightslategray'
				}`}>{result.value}</span
			>
		{/each}
	</div>
</div>

<style>
	.root {
		display: grid;
		grid-template-columns: 40% 60%;
		grid-template-rows: auto auto;
		grid-template-areas: 'header header' 'search results';
		column-gap: 1em;
	}

	.header {
		grid-area: header;
	}

	.search {
		grid-area: search;
		padding: 1em;
	}

	.search-inputs {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto auto auto auto;
		row-gap: 1em;
		column-gap: 1em;
		align-items: center;
	}

	.actions {
		display: grid;
		grid-template-columns: auto auto auto;
	}

	.results {
		grid-area: results;
		line-height: 1.6em;
		border: 1px solid gray;
		padding: 2em;
		max-width: 900px;
		max-height: 500px;
		overflow: hidden;
		overflow-y: scroll;
		overscroll-behavior: contain;
	}

	.result.match {
		background-color: var(--search-for-color);
		color: white;
		padding: 0 0.25em;
		display: inline-block;
	}

	.result.in-range {
		background-color: lightslategray;
		color: white;
	}
</style>

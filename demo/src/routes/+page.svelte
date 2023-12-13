<script lang="ts">
	import '@geoffcox/sterling-svelte/css/sterling.css';
	import { Button, Checkbox, Label, Tab, TabList, TextArea } from '@geoffcox/sterling-svelte';
	import { trieSearchString, type TrieSearchFoundRange } from 'trie-search';
	import { constitution as rawConstitution } from '../constitution';
	import { groupBy, orderBy, sortBy } from 'lodash-es';
	import { onMount } from 'svelte';
	import TrieSearchStringPanel from './TrieSearchStringPanel.svelte';

	type FormattedSearchResult = {
		value: string;
		isMatch: boolean;
		inRange: boolean;
		searchForIndex: number;
	};

	const constitution = rawConstitution.replaceAll('\n', '');

	const emptyStringSearchResults: FormattedSearchResult[] = [
		{
			value: constitution,
			isMatch: false,
			inRange: false,
			searchForIndex: -1
		}
	];

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

	let selectedSearchType = 'trieSearchString';

	let stringSearchFor = 'We the People';
	let caseInsensitive = false;
	let searchForStrings: string[] = [];
	let selectedSearchFor: string | undefined = undefined;
	let searchResults: TrieSearchFoundRange[] = [];

	const formatResults = (
		text: string,
		ranges: TrieSearchFoundRange[]
	): FormattedSearchResult[] => {
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
						searchForIndex: start.searchForIndex
					});
					inRange.push(start.searchForIndex);
				});
			}

			if (ends) {
				const sortedEnds = orderBy(ends, ['start', 'desc']);
				sortedEnds.forEach((end) => {
					results.push({
						value: ']',
						isMatch: true,
						inRange: false,
						searchForIndex: end.searchForIndex
					});
					const leaveRange = inRange.lastIndexOf(end.searchForIndex);
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

	$: stringSearchResults = formatResults(constitution, searchResults);

	const onStringSearch = () => {
		searchForStrings = stringSearchFor.split('\n').filter(Boolean);
		searchResults = trieSearchString(constitution, { caseInsensitive }, ...searchForStrings);
		selectedSearchFor = searchForStrings.length > 0 ? searchForStrings[0] : undefined;
	};

	const onStringSearchClear = () => {
		searchForStrings = [];
		stringSearchResults = emptyStringSearchResults;
	};

	let mounted = false;

	onMount(() => (mounted = true));
</script>

<div class="root light-mode">
	{#if mounted}
		<TabList bind:selectedValue={selectedSearchType}>
			<Tab value="trieSearchString">trieSearchString</Tab>
			<Tab value="trieSearchArray">trieSearchArray</Tab>
			<Tab value="trieSearch">trieSearch</Tab>
		</TabList>

		{#if selectedSearchType === 'trieSearchString'}
			<TrieSearchStringPanel />
		{:else if selectedSearchType === 'trieSearchArray'}
			<p>
				This demonstrates calling trieSearchString. Type one or more search phrases into the Search
				For field, then click the Search button.
			</p>
			<code>trieSearchString(text: string, options: &lbrace; caseInsensitive?: boolean &rbrace; ...searchFor: string[]) : TrieSearchResult[]</code>
			<Label text="Search for">
				<TextArea bind:value={stringSearchFor} autoHeight />
			</Label>
			<div>
				<Button on:click={onStringSearch}>Search</Button>
				<Button on:click={onStringSearchClear}>Clear</Button>
				<Checkbox bind:checked={caseInsensitive}>Case insensitive</Checkbox>
			</div>
			<div>
				{#each searchForStrings as searchForString, i}
					<span>
						<span class="search-term">{searchForString}</span>
						<span
							class="search-term-count"
							style={`--search-for-color: ${
								stringSearchForColors[i] || 'lightslategray'
							}`}
						>
							{searchResults.filter(
								(sr) => sr.searchForIndex === searchForStrings.indexOf(searchForString)
							).length}</span
						>
					</span>
				{/each}
			</div>
			<div class="results">
				<div class="long-text">
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
		{/if}
	{/if}
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		row-gap: 1em;
	}
	.long-text {
		max-height: 500px;
		overflow-y: scroll;
		scroll-behavior: smooth;
		border: 1px solid gray;
		padding: 0.5em;
		font-family: sans-serif;
	}

	.results {
		display: grid;
		grid-template-columns: auto 1fr;
		line-height: 1.6em;
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

	.search-term-count {
		color: white;
		background-color: var(--search-for-color);
		margin-right: 0.25em;
		border-radius: 50%;
		padding: 0.25em;
	}

	.search-term {
		margin-right: 0.25em;
		border-radius: 1em;
		padding: 0.25em;
	}
</style>

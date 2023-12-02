<script lang="ts">
	import '@geoffcox/sterling-svelte/css/sterling.css';
	import { Button, Label, List, ListItem, Tab, TabList, TextArea } from '@geoffcox/sterling-svelte';
	import { trieSearchString, type TrieSearchFoundRange } from 'trie-search';
	import { constitution as rawConstitution } from '../constitution';

	type FormattedSearchResult = { value: string; matched: boolean; searchForIndex: number };

	const constitution = rawConstitution.replaceAll('\n', '');

	const emptyStringSearchResults: FormattedSearchResult[] = [
		{
			value: constitution,
			matched: false,
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
	let searchForStrings: string[] = [];
	let selectedSearchFor: string | undefined = undefined;
	let searchResults: TrieSearchFoundRange[] = [];

	$: selectedSearchForIndex = selectedSearchFor ? searchForStrings.indexOf(selectedSearchFor) : -1;

	const formatSearchResults = (
		text: string,
		ranges: TrieSearchFoundRange[]
	): FormattedSearchResult[] => {
		if (ranges.length === 0) {
			return [
				{
					value: text,
					matched: false,
					searchForIndex: -1
				}
			];
		}

		let i = 0;
		const formattedResults: FormattedSearchResult[] = [];
		ranges.forEach((result) => {
			const before = text.slice(i, result.start);
			if (before.length > 0) {
				formattedResults.push({
					value: before,
					matched: false,
					searchForIndex: -1
				});
			}
			const matched = text.slice(result.start, result.end);
			if (matched.length > 0) {
				formattedResults.push({
					value: matched,
					matched: true,
					searchForIndex: result.searchForIndex
				});
			}
			i = result.end;
		});

		const after = text.slice(i);
		if (after.length > 0) {
			formattedResults.push({
				value: after,
				matched: false,
				searchForIndex: -1
			});
		}

		return formattedResults;
	};

	$: stringSearchResults = formatSearchResults(
		constitution,
		searchResults.filter((sr) => sr.searchForIndex === selectedSearchForIndex)
	);

	const onStringSearch = () => {
		searchForStrings = stringSearchFor.split('\n').filter(Boolean);
		searchResults = trieSearchString(constitution, ...searchForStrings);
		selectedSearchFor = searchForStrings.length > 0 ? searchForStrings[0] : undefined;
	};

	const onStringSearchClear = () => {
		searchForStrings = [];
		stringSearchResults = emptyStringSearchResults;
	};
</script>

<div class="root light-mode">
	<TabList bind:selectedValue={selectedSearchType}>
		<Tab value="trieSearchString">trieSearchString</Tab>
		<Tab value="trieSearchArray">trieSearchArray</Tab>
		<Tab value="trieSearch">trieSearch</Tab>
	</TabList>

	{#if selectedSearchType === 'trieSearchString'}
		<p>
			This demonstrates calling trieSearchString. Type one or more search phrases into the Search
			For field, then click the Search button.
		</p>
		<code>trieSearchString(text: string, ...searchFor: string[]) : TrieSearchResult[]</code>
		<Label text="Search for">
			<TextArea bind:value={stringSearchFor} autoHeight />
		</Label>
		<div>
			<Button on:click={onStringSearch}>Search</Button>
			<Button on:click={onStringSearchClear}>Clear</Button>
		</div>
		<p>
			The trie search finds all the search for phrases at once. Since found phrases might overlap,
			select the phrase in the list to see the highlighted results. Switching between phrases in the
			list does not re-run the search.
		</p>
		<div class="results">
			<List bind:selectedValue={selectedSearchFor}>
				{#each searchForStrings as searchForString, i}
					<ListItem value={searchForString}>
						<span>
							<span class="search-term">{searchForString}</span>
							<span
								class="search-term-count"
								style={`background-color: ${stringSearchForColors[i] || 'lightslategray'}`}
								>
								{searchResults.filter(
									(sr) => sr.searchForIndex === searchForStrings.indexOf(searchForString)
								).length}</span
							>
						</span>
					</ListItem>
				{/each}
			</List>
			<div class="long-text">
				{#each stringSearchResults as result}
					<span
						class:matched={result.matched}
						style={`background-color: ${
							result.searchForIndex >= 0
								? stringSearchForColors[result.searchForIndex] || 'lightslategray'
								: 'white'
						}`}>{result.value}</span
					>
				{/each}
			</div>
		</div>
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

	.matched {
		background-color: lightslategray;
		color: white;
	}

	.results {
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.search-term-count {
		color: white;
		margin-right: 0.25em;
		border-radius: 50%;
		padding: 0.25em;
	}

	.search-term {
		color: white;
		margin-right: 0.25em;
		border-radius: 1em;
		padding: 0.25em;
	}
</style>

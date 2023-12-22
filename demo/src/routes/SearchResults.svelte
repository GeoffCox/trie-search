<script lang="ts">
	import { groupBy, orderBy, sortBy } from 'lodash-es';
	import { createRange, createWordIteratorRanges, type TrieSearchFoundRange } from 'trie-search';
	import { searchColors } from './searchColors';

	/* ----- Formatting  ----- */

	type FormattedSearchResult = {
		value: string;
		isMatch: boolean;
		inRange: boolean;
		searchForIndex: number;
		isLineBreak?: boolean;
	};

	const formatResults = (text: string, ranges: TrieSearchFoundRange[]): FormattedSearchResult[] => {
		const byStart = groupBy(ranges, 'start');
		const byEnd = groupBy(ranges, 'end');

		let results: FormattedSearchResult[] = [];
		let inRange: number[] = [];
		let current: string = '';
		for (let i = 0; i < text.length; i++) {
			if (text[i] === '\n') {
				if (current.length > 0) {
					results.push({
						value: current,
						isMatch: false,
						inRange: inRange.length > 0,
						searchForIndex: -1
					});
					current = '';
				}

				results.push({
					value: text[i],
					isMatch: false,
					inRange: false,
					searchForIndex: -1,
					isLineBreak: true
				});
			}

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

	const formatWordResults = (
		text: string,
		ranges: TrieSearchFoundRange[]
	): FormattedSearchResult[] => {
		const rangeMap = createWordIteratorRanges(text);
		const wordRanges: TrieSearchFoundRange[] = ranges.map((r) => {
			const newRange = createRange({
				start: rangeMap[r.start].start,
				end: r.start === r.end ? rangeMap[r.end].end : rangeMap[r.end - 1].end
			});
			return {
				...r,
				...newRange
			};
		});

		return formatResults(text, wordRanges);
	};

	/* ----- Props ----- */

	export let text: string;
	export let results: TrieSearchFoundRange[] = [];
	export let wordByWord = false;

	/* ----- State ----- */

	$: formattedResults = wordByWord
		? formatWordResults(text, results)
		: formatResults(text, results);
</script>

<!--
@component
Displays the text with the search results highlighted.
-->
<div class="search-results">
	{#each formattedResults as result}
		{#if result.isLineBreak}
			<br />
		{:else}
			<span
				class="result"
				class:match={result.isMatch}
				class:in-range={result.inRange}
				style={`--search-for-color: ${searchColors[result.searchForIndex] || 'lightslategray'}`}
				>{result.value}</span
			>
		{/if}
	{/each}
</div>

<style>
	.search-results {
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
</style>

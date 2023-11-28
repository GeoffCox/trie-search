<script lang="ts">
	import '@geoffcox/sterling-svelte/css/sterling.css';
	import { Button, TextArea } from '@geoffcox/sterling-svelte';
    import { addSearchTokensToTrieNode, trieSearch, type TrieNode, createCharacterTokenizer, createWordTokenizer, trieSearchString, trieSearchNumbers} from "trie-search";
	import { constitution } from '../constitution';

// I can search text for a string and get back the character ranges of occurances
// triSearch(text: string, searchFor: string) : { start: number, end: number}[]


// I can search text for a set of strings and get back the character ranges of occurances per search string.
//


// I can search a set of tokens for multiple sequence of tokens and get back
// the range of values that work.
// trieSearch(textTokens: string[], searchTokens: string[][]) : TrieRange
// trieSearch(textTokens: TokenStream, searchTokens: string[][])
// 

// ts(text: string, searchFor: string, tokenizer: Tokenizer = CharacterTokenizer) : TrieRange
// ts(text: string, searchFor: string[], tokenizer: Tokenizer = CharacterTokenizer) : TrieRange
// ts(tokens: Iterator<string>, searchFor: Iterator<string>) : TrieRange
// ts(tokens: Iterator<string>, searchFor: Iterator<Iterator<string>>) : TrieRange

    const foo = <T>(iterator: Iterator<T>) => {
        while (iterator.next()) {
            console.log('.');
        }
    }

	const onSearch = () => {
		
        const searchTerms = [
            "shall be",
        ];

        const text = constitution;

        const searchTokenizers = searchTerms.map(createCharacterTokenizer);
        const textTokenizer = createCharacterTokenizer(text);

        const node : TrieNode = {};
        searchTokenizers.forEach(st => addSearchTokensToTrieNode(st, node));
        const ranges = trieSearch(textTokenizer, node);
        console.log(text);
        console.log(searchTerms);
        console.log(node);
        console.log(ranges);

        ranges.forEach(range => console.log(text.slice(range.start, range.end)));
        
        const ranges2 = trieSearchString(text,"shall be");
        console.log(ranges2);
        ranges2.forEach(range => console.log(text.slice(range.start, range.end)));

        const someNumbers = [10,15,23,10,56,45,222,894572,15,23]
        const ranges3 = trieSearchNumbers(someNumbers,[15, 23]);
        console.log(ranges3);
        ranges3.forEach(range => console.log(someNumbers.slice(range.start, range.end)));
	};
</script>

<div class="light-mode">
	<Button on:click={onSearch}>Go</Button>

    <TextArea autoHeight value={constitution} />
</div>

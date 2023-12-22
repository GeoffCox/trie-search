# @geoffcox/trie-search

A Trie search algorithm written in Typescript.

Trie search supports finding occurrences of multiple sequences with a single pass over the data.
The elements of the sequence are often characters, but can be string tokens, numbers, or other value-comparable types.
It does this by building a n-ary tree for the search sequences where common subsequences are shared
in the tree structure. The tree is then walked as elements match in the data.

Read more about Trie here: https://en.wikipedia.org/wiki/Trie

## Features

- Each search results include the association back to the sequence being searched for.

  For example, if 'apple','pear', and 'banana' are being searched for within 'I prefer an pear with my lunch.', then the search result
  for 'pear' would include a search index of 1 to indicate it matches the second search term.

- This algorithm will find all occurrences of the search sequences, including when multiple matches appear within overlapping portions of the data.

  For example, if the data contains the word 'tease' the algorithm can find 'tea', 'tease', and 'ease'.

- The package includes convenience methods for searching strings and arrays of items to avoid callers needing to instantiate iterators for common scenarios.

- Iterator factory functions are provided for characters and words including case-sensitive/insensitive search.

## Demo

"Trie" it out at http://geoffcox.github.io/demos/trie-search

## Installation

```
npm install @geoffcox/trie-search
```

## Usage

### trieSearchString

This method trie searches text character-by-character.

```ts
const wizardOfOz = fs.readFileSync("./the-wizard-of-oz.txt");

const options = { caseInsensitive: true };

const results = trieSearchString(wizardOfOz, options, "good witch", "yellow brick road", "there's no place like home");

results.forEach((result) => {
  console.log(
    `Found ${wizardOfOz.substring(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

### trieSearchWords

This method trie searches text word-by-word. This can improve performance and reduce memory usage.

There are fewer:

- nodes in the search tree.
- nodes in the in-progress arrays of matching sequences
- comparisons during search

```ts
const wizardOfOz = fs.readFileSync("./the-wizard-of-oz.txt");

const options = { caseInsensitive: true, includeWhitspace: false, excludeDelimiters: false };

const results = trieSearchWords(bookIterator, options, "good witch", "yellow brick road", "there's no place like home");

results.forEach((result) => {
  console.log(
    `Found ${wizardOfOz.substring(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

### trieSearchArray

This method trie searches an array item-by-item. The items should have value comparisons that allow storing in a Map.

```ts
const someNumbers = [300, 45, 231, 11, 934, 20, 231, 982, 11, 3459, 18, 234, 231, 11];

const results = trieSearchArray(someNumbers, {}, 231, 11);

// expect to find 231,11 at [2,4)(2) and [12,14)(2)
results.forEach((result) => {
  console.log(
    `Found ${someNumbers.slice(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

### trieSearchSequence

This method trie searches a sequence of items for search sequences of items. It gives you the control over iterator creation.

```ts
const wizardOfOz = fs.readFileSync("./the-wizard-of-oz");

const options = { caseInsensitive: true };

const bookIterator = createCharacterIterator(wizardOfOz, options);

const searchIterators = [
  createCharacterIterator("good witch", options),
  createCharacterIterator("yellow brick road", options),
  createCharacterIterator("there's no place like home", options),
];

const results = trieSearchSequence(bookIterator, {}, ...searchIterators);

results.forEach((result) => {
  console.log(
    `Found ${wizardOfOz.substring(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

### trieSearch

This is the core method of the Trie search algorithm. It gives you control over creating the TrieNode instance
as well as the iterator of the data to search.

```ts
const wizardOfOz = fs.readFileSync("./the-wizard-of-oz");

const options = { caseInsensitive: true };

const bookIterator = createCharacterIterator(wizardOfOz, options);

const node: TrieNode<string> = {};
addToTrieNode(createCharacterIterator("good witch", options), node);
addToTrieNode(createCharacterIterator("yellow brick road", options), node);
addToTrieNode(createCharacterIterator("there's no place like home", options), node);

const results = trieSearch(bookIterator, {}, node);

results.forEach((result) => {
  console.log(
    `Found ${wizardOfOz.substring(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

## TrieSearchOptions - onFound

The onFound callback allows you to monitor and end the search early.

```ts
const wizardOfOz = fs.readFileSync("./the-wizard-of-oz");

const options = { caseInsensitive: true };

const bookIterator = createCharacterIterator(wizardOfOz, options);

const node: TrieNode<string> = {};
addToTrieNode(createCharacterIterator("good witch", options), node);
addToTrieNode(createCharacterIterator("yellow brick road", options), node);
addToTrieNode(createCharacterIterator("there's no place like home", options), node);

let homeCount = 0;
const searchOptions: TrieSearchOptions = {
  onFound: (found: TrieSearchFoundRange) => {
    if (found.searchIndex === 1) {
      return "discard";
    }
    if (found.searchIndex === 2) {
      if (homeCount >= 3) {
        return "done";
      }
      homeCount++;
    }
    return "save";
  },
};

const results = trieSearch(bookIterator, {}, node);

results.forEach((result) => {
  console.log(
    `Found ${wizardOfOz.substring(result.start, result.end)} at [${result.start},${result.end})(${result.length})`
  );
});
```

## Built-in iterators

The library has `createCharacterIterator` and `createWordIterator` that make it easy to create iterators from a string.
You should only need these when `trieSearchString` and `trieSearchWords` aren't what you need.

If you have an array of items and want an iterator, you can use the Symbol.iterator as an indexor. This returns a function that creates an iterator.

```ts
const items = []; //some array of items
const iterator = items[Symbol.iterator]();
```

You can read more about [Iterators and Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) on MDN.

## Helpful Range functions

The trie search returns a `TrieSearchFoundRange[]`. Each result is `Range` which has `start`, `end`, and `length`.

A set of range functions `createRange`, `isRangeValid`, `rangeContains`, `rangesEqual`, `rangesOverlap`, and `rangeToString` are provided to make it easier to work with ranges.

## Displaying TrieNode trees

The `TrieNode<T>` the `children` property is a `Map<T, TrieNode<T>`. This allows nodes to avoid storing their values
in addition to their parent storing it as a lookup key. However, a `Map` isn't very easy to iterate and this makes
displaying a trie node tree difficult.

The `createTrieDisplayTree` converts a trie node tree structure to one easier to navigate and display. The `children` is
a `TrieDisplayNode<T>[]` and each node has a `value`.

import { createCharacterIterator } from "./characterIterator";
import { TrieSearchFoundRange, TrieNode, addToTrieNode, trieSearch as _trieSearch } from "./trieSearch";

// I can search text for a single string
// I can search text for multiple strings
// I can search a set of tokens for a sequence of tokens
// I can search a set of tokens for multiple sequences of tokens

/**
 * Trie search of a set of items for one or more sequences.
 * @param items The items to search.
 * @param searchFor One or more sequences to search for within items.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 * @example
 * const items = ["The","quick","brown","fox","jumps","over","the","lazy","dog"];
 * const searchFox = ["quick","brown","fox"];
 * const searchDog = ["lazy","dog"];
 *
 * // An Iterator<T> can be accessed from any Array<T> by calling the Symbol.iterator method.
 * // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
 * const results = trieSearch(items[Symbol.iterator](), searchFox[Symbol.iterator](), searchDog[Symbol.iterator]());
 *
 * // Expect searchFox to be found at [1,4) and searchDog to be found at [7,9)
 * // [0]: { searchId: 0, start: 1, end: 4, length: 3}
 * // [1]: { searchId: 1, start: 7, end: 9, length: 2}
 * console.log(results);
 */
export const trieSearch = <T>(items: Iterator<T>, ...searchFor: Iterator<T>[]): TrieSearchFoundRange[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf, node);
  });
  return _trieSearch(items, node);
};

/**
 * Trie search of an array of items for one or more array sequences.
 * Calls trieSearch with each parameter's array iterator, returning array indexed results.
 * @param items The items to search.
 * @param searchFor One or more sequences to search for within items.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 * @example
 * const items = ["The","quick","brown","fox","jumps","over","the","lazy","dog"];
 * const searchFox = ["quick","brown","fox"];
 * const searchDog = ["lazy","dog"];
 *
 * const results = trieSearchArray(items, searchFox, searchDog);
 *
 * // Expect searchFox to be found at [1,4) and searchDog to be found at [7,9)
 * // [0]: { searchId: 0, start: 1, end: 4, length: 3}
 * // [1]: { searchId: 1, start: 7, end: 9, length: 2}
 * console.log(results);
 */
export const trieSearchArray = <T>(items: T[], ...searchFor: T[][]): TrieSearchFoundRange[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf[Symbol.iterator](), node);
  });

  return _trieSearch(items[Symbol.iterator](), node);
};

type TrieSearchStringOptions = {
  caseInsensitive: boolean;
};

/**
 * Trie search of a string for one or more strings.
 * Calls trieSearch with each parameter's string iterator, returning character indexed results.
 * @param text The string to search.
 * @param searchFor One or more strings to search for within text.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 * @example
 * const text = 'The quick brown fox jumps over the lazy dog';
 * const searchFox = 'quick brown fox';
 * const searchDog = 'lazy dog';
 * const results = trieSearchString(text, searchFox, searchDog);
 *
 * // Expect searchFox to be found at [4,19) and searchDog to be found at [35,43)
 * // [0]: { searchId: 0, start: 4, end: 19, length: 15}
 * // [1]: { searchId: 1, start: 35, end: 43, length: 8}
 * console.log(results);
 */
export const trieSearchString = (
  text: string,
  options: Partial<TrieSearchStringOptions>,
  ...searchFor: string[]
): TrieSearchFoundRange[] => {
  const textIterator = createCharacterIterator(text, { caseInsensitive: options.caseInsensitive});

  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(createCharacterIterator(sf, { caseInsensitive: options.caseInsensitive}), node);
  });

  console.log(node);

  return _trieSearch(textIterator, node);
};

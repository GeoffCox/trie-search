import { CharacterIteratorOptions, createCharacterIterator } from "./characterIterator";
import { TrieSearchFoundRange, TrieNode, addToTrieNode, trieSearch } from "./trieSearch";
import { WordIteratorOptions, createWordIterator } from "./wordIterator";

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

  return trieSearch(items[Symbol.iterator](), node);
};

/**
 * Trie search of a string for one or more strings.
 * Search is character by character.
 * @param text The string to search.
 * @param options The options for createCharacterIterator.
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
  options: Partial<CharacterIteratorOptions>,
  ...searchFor: string[]
): TrieSearchFoundRange[] => {
  const textIterator = createCharacterIterator(text, options);

  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(createCharacterIterator(sf, options), node);
  });

  return trieSearch(textIterator, node);
};

/**
 * Trie search of a string of words for one or more strings of words.
 * Calls trieSearch with each parameter's string iterator, returning word indexed results.
 * @param text The string of words to search.
 * @param options The options for createWordIterator.
 * @param searchFor One or more strings of words to search for within text.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 * @example
 * const text = 'The quick brown fox jumps over the lazy dog.';
 * const searchFox = 'quick brown fox';
 * const searchDog = 'lazy dog';
 * const results = trieSearchWords(text, searchFox, searchDog);
 *
 * // Expect searchFox to be found at [4,19) and searchDog to be found at [35,43)
 * // [0]: { searchId: 0, start: 4, end: 19, length: 15}
 * // [1]: { searchId: 1, start: 35, end: 43, length: 8}
 * console.log(results);
 */
export const trieSearchWords = (
  text: string,
  options: Partial<WordIteratorOptions>,
  ...searchFor: string[]
): TrieSearchFoundRange[] => {
  const textIterator = createWordIterator(text, options);

  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(createWordIterator(sf, options), node);
  });

  return trieSearch(textIterator, node);
};

/**
 * Trie search of a sequence of items for one or more search sequences.
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
export const trieSearchSequence = <T>(items: Iterator<T>, ...searchFor: Iterator<T>[]): TrieSearchFoundRange[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf, node);
  });
  return trieSearch(items, node);
};
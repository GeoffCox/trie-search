import { CharacterIteratorOptions, createCharacterIterator } from "./characterIterator";
import { TrieSearchFoundRange, TrieNode, addToTrieNode, trieSearch, TrieSearchOptions } from "./trieSearch";
import { WordIteratorOptions, createWordIterator } from "./wordIterator";

/**
 * Trie search of an array of items for one or more array sequences.
 * Calls trieSearch with each parameter's array iterator, returning array indexed results.
 * @param items The items to search.
 * @param options Options to control the search.
 * @param searchFor One or more sequences to search for within items.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 */
export const trieSearchArray = <T>(items: T[], options: TrieSearchOptions, ...searchFor: T[][]): TrieSearchFoundRange[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf[Symbol.iterator](), node);
  });

  return trieSearch(items[Symbol.iterator](), options, node);
};

/**
 * Trie search of a string for one or more strings.
 * Search is character by character.
 * @param text The string to search.
 * @param options Options to control the search.
 * @param searchFor One or more strings to search for within text.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 */
export const trieSearchString = (
  text: string,
  options: TrieSearchOptions & CharacterIteratorOptions,
  ...searchFor: string[]
): TrieSearchFoundRange[] => {
  const textIterator = createCharacterIterator(text, options);

  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(createCharacterIterator(sf, options), node);
  });

  return trieSearch(textIterator, options, node);
};

/**
 * Trie search of a string of words for one or more strings of words.
 * Calls trieSearch with each parameter's string iterator, returning word indexed results.
 * @param text The string of words to search.
 * @param options Options to control the search.
 * @param searchFor One or more strings of words to search for within text.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 */
export const trieSearchWords = (
  text: string,
  options: TrieSearchOptions & WordIteratorOptions,
  ...searchFor: string[]
): TrieSearchFoundRange[] => {
  const textIterator = createWordIterator(text, options);

  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(createWordIterator(sf, options), node);
  });

  return trieSearch(textIterator, options, node);
};

/**
 * Trie search of a sequence of items for one or more search sequences.
 * @param items The items to search.
 * @param options Options to control the search.
 * @param searchFor One or more sequences to search for within items.
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 */
export const trieSearchSequence = <T>(items: Iterator<T>, options: TrieSearchOptions, ...searchFor: Iterator<T>[]): TrieSearchFoundRange[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf, node);
  });
  return trieSearch(items, options, node);
};
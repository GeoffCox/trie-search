import { TrieSearchResult, TrieNode, addToTrieNode, trieSearch as _trieSearch } from "./trieSearch";

export const trieSearch = <T>(itemsIterator: Iterator<T>, ...searchFor: Iterator<T>[]): TrieSearchResult[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf, node);
  });
  return _trieSearch(itemsIterator, node);
};

export const trieSearchArray = <T>(items: T[], ...searchFor: T[][]): TrieSearchResult[] => {
  const node: TrieNode<T> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf[Symbol.iterator](), node);
  });

  return _trieSearch(items[Symbol.iterator](), node);
};

export const trieSearchString = (text: string, ...searchFor: string[]): TrieSearchResult[] => {
  const textIterator = text[Symbol.iterator]();
  const node: TrieNode<string> = {};
  searchFor.forEach((sf) => {
    addToTrieNode(sf[Symbol.iterator](), node);
  });

  return _trieSearch(textIterator, node);
};

export const trieSearchNumbers = trieSearchArray<number>;

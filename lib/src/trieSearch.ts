import { type Range, createRange } from "./range";

export type TrieNode<T> = {
  children?: Map<T, TrieNode<T>>;
  startIds?: number[];
  endIds?: number[];
};

/**
 * A range for a sequence found by trie search.
 */
export type TrieSearchFoundRange = Range & {
  /** The index of the matching the searchFor parameter passed to trieSearch. */
  searchForIndex: number;
};

const validateChildNode = <T>(node: TrieNode<T>, key: T, isRootChild: boolean) => {
  const hasStartIds = node.startIds && node.startIds.length > 0;

  // First children must have a start ID
  if (isRootChild) {
    if (!hasStartIds) {
      throw new Error(`The ${key} node is missing a start ID.`);
    }
  } else if (hasStartIds) {
    // No other children can have a start ID
    throw new Error(`The ${key} node is an intermediate or end node but has a start ID.`);
  }

  // Any child without children must end a phrase
  if (!node.children || node.children.size === 0) {
    if (!node.endIds || node.endIds.length === 0) {
      throw new Error(`The ${key} node is missing an end ID and has no children.`);
    }
  } else {
    // Validate each child
    const keyIterator = node.children.keys();
    let key = keyIterator.next();
    while (!key.done) {
      const child = node.children.get(key.value);
      if (!child) {
        throw new Error(`The ${key.value} node is not defined.`);
      }
      validateChildNode(child, key.value, false);
      key = keyIterator.next();
    }
  }
};

const validateNode = <T>(node: TrieNode<T>) => {
  if (!node) {
    throw new Error("The node parameter is not defined.");
  }

  if (node.startIds && node.startIds.length > 0) {
    throw new Error("The root node has start IDs. Direct children of the root node should start phrases.");
  }

  if (node.endIds && node.endIds.length > 0) {
    throw new Error("The root node has end IDs. Descendants of the root node should end phrases.");
  }

  // Validate children
  if (node.children) {
    // Validate each child
    const keyIterator = node.children.keys();
    let key = keyIterator.next();
    while (!key.done) {
      const child = node.children.get(key.value);
      if (!child) {
        throw new Error(`The ${key.value} node is not defined.`);
      }
      validateChildNode(child, key.value, true);
      key = keyIterator.next();
    }
  }
};

export const addToTrieNode = <T>(iterator: Iterator<T>, node: TrieNode<T>): number => {
  validateNode(node);

  if (!node.children) {
    node.children = new Map<T, TrieNode<T>>();
  }

  // I give each sequence an incremental ID
  const nodeChildrenValues = [...node.children.values()];
  const searchId = nodeChildrenValues.reduce<number>((sum, current) => {
    return sum + (current?.startIds?.length || 0);
  }, 0);

  let currentNode = node;

  let i = 0;
  let token = iterator.next();

  while (!token.done) {
    currentNode.children = currentNode.children || new Map<T, TrieNode<T>>();
    if (currentNode.children.get(token.value) === undefined || currentNode.children.get(token.value) === null) {
      const newNode: TrieNode<T> = {};
      currentNode.children!.set(token.value, newNode);
      currentNode = newNode;
    } else {
      currentNode = currentNode.children.get(token.value)!;
    }

    // Mark the first token as the start of the sequence
    if (i === 0) {
      currentNode.startIds = currentNode.startIds || [];
      currentNode.startIds.push(searchId);
    }

    token = iterator.next();
    i++;

    // Mark the last token as the end of the sequence
    if (token.done) {
      currentNode.endIds = currentNode.endIds || [];
      currentNode.endIds.push(searchId);
    }
  }

  return searchId;
};

type TrieSequence<T> = {
  /**
   * The current node in the sequence.
   */
  node: TrieNode<T>;
  /**
   * The start position of this sequence
   */
  start: number;
};

/**
 * Trie search of a set of items for one or more sequences.
 * @param iterator The items to search
 * @param node The trie node representing the sequences to search for
 * @returns A search result for each found sequence within items. Each result's searchForIndex corresponds to the order
 * of searchFor parameters.
 */
export const trieSearch = <T>(iterator: Iterator<T>, node: TrieNode<T>): TrieSearchFoundRange[] => {
  validateNode(node);

  const result: TrieSearchFoundRange[] = [];

  // track the node we are on for each in progress sequence
  const sequences: TrieSequence<T>[] = [];

  let i = 0;
  let item = iterator.next();
  while (!item.done) {
    // check each in progress sequence to see if this item moves to the next node in the sequence
    let p = 0;
    while (p < sequences.length) {
      const progressNode = sequences[p].node.children!.get(item.value);
      if (progressNode !== undefined) {

        // if this node has any end IDs, add results
        progressNode.endIds?.forEach((endId) => {
          const tokenRange = createRange<TrieSearchFoundRange>({
            searchForIndex: endId,
            start: sequences[p].start,
            end: i + 1,
          });
          result.push(tokenRange);
        });

        // if the in progress sequence continues, then move to this node
        if (progressNode.children && progressNode.children.size > 0) {
          sequences[p].node = progressNode as TrieNode<T>;
          p++;
        } else {
          // otherwise, we're done with this node
          sequences.splice(p, 1);
        }
      } else {
        // if the in progress sequence doesn't continue, then remove it.
        sequences.splice(p, 1);
      }
    }

    // check for the start of new sequences
    const firstChildNode = node.children?.get(item.value);
    if (firstChildNode) {

      // if this first child has any end IDs, add results
      firstChildNode.endIds?.forEach((endId) => {
        const start = i;
        const tokenRange = createRange<TrieSearchFoundRange>({
          searchForIndex: endId,
          start: start,
          end: i + 1,
        });
        result.push(tokenRange);
      });

      // if the node continues, add in progress
      if (firstChildNode.children && firstChildNode.children.size > 0) {
        sequences.push({
          node: firstChildNode,
          start: i,
        });
      }
    }

    item = iterator.next();
    i++;
  }

  return result;
};

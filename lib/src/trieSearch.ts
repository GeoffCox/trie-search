import { type Range, createRange } from "./range";

/**
 * A node representing one or more sequences to search for in a trie search.
 */
export type TrieNode<T> = {
  /** The nodes following in the sequence */
  children?: Map<T, TrieNode<T>>;

  /** The index of the searchFor parameter for this sequence. */
  searchIndices?: number[];

  /** The index of the searchFor parameter when this node ends the sequence. */
  endSearchIndices?: number[];
};

/**
 * A range for a sequence found by trie search.
 */
export type TrieSearchFoundRange = Range & {
  /** The index of the matching the searchFor parameter passed to trieSearch. */
  searchIndex: number;
};

/**
 * Options for controlling a trie search.
 */
export type TrieSearchOptions = {
  /** Called as each range is found during a trie search.
   *  @returns How the found range should be processed:
   * - 'cancel' will not add the range to the results and ends the search.
   * - 'done' to add the range to the results and ends the search.
   * - 'discard' will not add the range to the results and keep searching.
   * - 'save' will add the range to the results and keep searching.
   */
  onFound?: (range: TrieSearchFoundRange) => "save" | "discard" | "cancel" | "done";
};

const validateChildNode = <T>(node: TrieNode<T>, key: T) => {
  // every node must be part of a search
  if (!node.searchIndices || node.searchIndices.length === 0) {
    throw new Error(`The ${key} node is missing search indices.`);
  }

  // Any child without children must end a sequence
  if (!node.children || node.children.size === 0) {
    if (!node.endSearchIndices || node.endSearchIndices.length === 0) {
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
      validateChildNode(child, key.value);
      key = keyIterator.next();
    }
  }
};

const validateNode = <T>(node: TrieNode<T>) => {
  if (!node) {
    throw new Error("The node parameter is not defined.");
  }

  if (node.searchIndices && node.searchIndices.length > 0) {
    throw new Error("The root node has search IDs. Direct children of the root node should have search IDs.");
  }

  if (node.endSearchIndices && node.endSearchIndices.length > 0) {
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
      validateChildNode(child, key.value);
      key = keyIterator.next();
    }
  }
};

/**
 * Add a search sequence to a trie node.
 * @param iterator The iterator of the search sequence to add.
 * @param node The target node for adding the sequence.
 * @returns The search index for the added sequence.
 */
export const addToTrieNode = <T>(iterator: Iterator<T>, node: TrieNode<T>): number => {
  validateNode(node);

  if (!node.children) {
    node.children = new Map<T, TrieNode<T>>();
  }

  // I give each sequence an incremental ID
  const nodeChildrenValues = [...node.children.values()];
  const searchId = nodeChildrenValues.reduce<number>((sum, current) => {
    return sum + (current?.searchIndices?.length || 0);
  }, 0);

  let currentNode = node;
  let item = iterator.next();

  while (!item.done) {
    currentNode.children = currentNode.children || new Map<T, TrieNode<T>>();
    if (currentNode.children.get(item.value) === undefined || currentNode.children.get(item.value) === null) {
      const newNode: TrieNode<T> = {};
      currentNode.children!.set(item.value, newNode);
      currentNode = newNode;
    } else {
      currentNode = currentNode.children.get(item.value)!;
    }

    currentNode.searchIndices = currentNode.searchIndices || [];
    currentNode.searchIndices.push(searchId);

    item = iterator.next();

    // Mark the last token as the end of the sequence
    if (item.done) {
      currentNode.endSearchIndices = currentNode.endSearchIndices || [];
      currentNode.endSearchIndices.push(searchId);
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
   * The start position of this sequence.
   */
  start: number;
};

/**
 * Trie search of a sequences of items using a trie search node.
 * @param iterator The items to search.
 * @param options Options to control the search.
 * @param node The trie node representing the search for sequences.
 * @returns The ranges found by searching.
 */
export const trieSearch = <T>(
  iterator: Iterator<T>,
  options: TrieSearchOptions,
  node: TrieNode<T>
): TrieSearchFoundRange[] => {
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
        if (progressNode.endSearchIndices) {
          for (let j = 0; j < progressNode.endSearchIndices?.length; j++) {
            const endId = progressNode.endSearchIndices[j];
            const foundRange = createRange<TrieSearchFoundRange>({
              searchIndex: endId,
              start: sequences[p].start,
              end: i + 1,
            });

            const onFoundAction = options.onFound?.(foundRange) || "save";
            if (onFoundAction === "save" || onFoundAction === "done") {
              result.push(foundRange);
            }
            if (onFoundAction === "cancel" || onFoundAction === "done") {
              return result;
            }
          }
        }

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
      if (firstChildNode.endSearchIndices) {
        for (let j = 0; j < firstChildNode.endSearchIndices?.length; j++) {
          const endId = firstChildNode.endSearchIndices[j];
          const start = i;
          const foundRange = createRange<TrieSearchFoundRange>({
            searchIndex: endId,
            start: start,
            end: i + 1,
          });

          const onFoundAction = options.onFound?.(foundRange) || "save";
          if (onFoundAction === "save" || onFoundAction === "done") {
            result.push(foundRange);
          }
          if (onFoundAction === "cancel" || onFoundAction === "done") {
            return result;
          }
        }
      }

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

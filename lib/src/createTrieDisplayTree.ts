import { TrieNode } from "./trieSearch"

/**
 * A trie node for use in displaying trie trees.
 * The children are an array instead of a map and the value is contained within the node.
 */
export type TrieDisplayNode<T> = Omit<TrieNode<T>, 'children'> & {
    
    /** The nodes following in the sequence */
    children?: TrieDisplayNode<T>[];

    /** The value of the node */
    value: T;
  };

const createDisplayNode = <T>(value: T, node: TrieNode<T>) : TrieDisplayNode<T> => {

    const children = node.children ? [...node.children.entries()] : undefined;

    return {
        ...node,
        value,
        children: children?.map(child => createDisplayNode(child[0], child[1]))
    };
};

/**
 * Converts a TrieNode and its descendants to a TrieDisplayNode
 * @param rootValue The value of the root of the tree.
 * @param node The node to convert
 * @returns A TrieDisplayNode for displaying the trie node tree.
 */
export const createTrieDisplayTree = <T>(rootValue: T, node: TrieNode<T>) => {
   return createDisplayNode(rootValue, node);
}
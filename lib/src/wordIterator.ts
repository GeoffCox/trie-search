const whitespaceChars = [" ", "\t", "\n", "\r"];

const delimiterChars = [
  "~",
  "`",
  "!",
  "@",
  "#",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ":",
  ";",
  '"',
  "'",
  "<",
  ",",
  ">",
  ".",
  "?",
  "/",
];

const doneResult: IteratorReturnResult<string> = { value: "", done: true };

/**
 * Options for iterating over words in a string.
 */
export type WordIteratorOptions = {
  /**
   * When true, whitespace is included as a word.
   * @default undefined (false)
   */
  includeWhitespace?: boolean;
  /**
   * When true, delimiters are not included as words.
   * @default undefined (false)
   */
  excludeDelimiters?: boolean;
  /**
   * When true, words are returned lowercase to support case-insensitive searching.
   * @default undefined (false)
   */
  caseInsensitive?: boolean;
};

/**
 * Creates an iterator over a string that returns each word in order when next() is called.
 * @param value The string to iterate.
 * @param options The options for iterating over the string by word.
 * @returns The iterator.
 */
export const createWordIterator = (value: string, options?: WordIteratorOptions): Iterator<string> => {
  let i = 0;
  const next = () => {
    const skipDelimiters = options && options.excludeDelimiters;
    const skipWhitespace = !options || !options.includeWhitespace;
    const charsToSkip = [...(skipDelimiters ? delimiterChars : []), ...(skipWhitespace ? whitespaceChars : [])];

    while (i < value.length && charsToSkip.includes(value[i])) {
      i++;
    }

    if (i >= value.length) {
      return doneResult;
    }

    let start = i;
    let current = i;

    while (
      current < value.length &&
      !whitespaceChars.includes(value[current]) &&
      !delimiterChars.includes(value[current])
    ) {
      current++;
    }

    current = current === start ? current + 1 : current;

    const nextPart =
      options?.caseInsensitive === true ? value.slice(start, current).toLowerCase() : value.slice(start, current);
    i = current;
    return { value: nextPart, done: false };
  };

  return {
    next,
  };
};

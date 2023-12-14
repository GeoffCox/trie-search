import { Range, createRange } from "./range";

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

  const skipDelimiters = options && options.excludeDelimiters;
  const skipWhitespace = !options || !options.includeWhitespace;
  const charsToSkip = [...(skipDelimiters ? delimiterChars : []), ...(skipWhitespace ? whitespaceChars : [])];

  const next = () => {
    while (i < value.length && charsToSkip.includes(value[i])) {
      i++;
    }

    if (i >= value.length) {
      return doneResult;
    }

    let start = i;
    let end = i;

    while (
      end < value.length &&
      !whitespaceChars.includes(value[end]) &&
      !delimiterChars.includes(value[end])
    ) {
      end++;
    }

    end = end === start ? end + 1 : end;

    const nextPart =
      options?.caseInsensitive === true ? value.slice(start, end).toLowerCase() : value.slice(start, end);
    i = end;
    return { value: nextPart, done: false };
  };

  return {
    next,
  };
};

export const createWordIteratorRanges = (value: string, options?: WordIteratorOptions): Range[] => {
  const result: Range[] = [];

  const skipDelimiters = options && options.excludeDelimiters;
  const skipWhitespace = !options || !options.includeWhitespace;
  const charsToSkip = [...(skipDelimiters ? delimiterChars : []), ...(skipWhitespace ? whitespaceChars : [])];

  let i = 0;
  while (i < value.length) {
    
    while (i < value.length && charsToSkip.includes(value[i])) {
      i++;
    }

    let start = i;
    let end = i;

    while (end < value.length && !whitespaceChars.includes(value[end]) && !delimiterChars.includes(value[end])) {
      end++;
    }

    end = end === start ? end + 1 : end;

    result.push(createRange({ start: i, end: end }));
    i = end;
  }

  return result;
};

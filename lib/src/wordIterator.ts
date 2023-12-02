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

export type CreateWordIteratorOptions = {
  includeWhitespace?: boolean;
  excludeDelimiters?: boolean;
};

export const createWordIterator = (value: string, options?: CreateWordIteratorOptions): Iterator<string> => {
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

    while (current < value.length && !whitespaceChars.includes(value[current]) && !delimiterChars.includes(value[current])) {
      current++;
    }

    current = current === start ? current + 1 : current;

    const nextPart = value.slice(start, current);
    i = current;
    return { value: nextPart, done: false };
  };

  return {
    next,
  };
};

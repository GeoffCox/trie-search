const doneResult: IteratorReturnResult<string> = { value: "", done: true };

/**
 * Options for iterating over characters in a string.
 */
export type CharacterIteratorOptions = {
  /**
   * When true, characters are returned lowercase to support case-insensitive searching.
   * @default undefined (false)
   */
  caseInsensitive?: boolean;
};

/**
 * Creates an iterator over a string that returns each character in order when next() is called.
 * @param value The string to iterate.
 * @param options The options for iterating over the string by character.
 * @returns The iterator.
 */
export const createCharacterIterator = (value: string, options?: CharacterIteratorOptions): Iterator<string> => {
  let i = 0;
  const next = () => {
    if (i >= value.length) {
      return doneResult;
    }

    const nextValue = value[i];
    i++;
    return { value: options?.caseInsensitive && nextValue ? nextValue.toLowerCase() : nextValue, done: false };
  };

  return {
    next,
  };
};

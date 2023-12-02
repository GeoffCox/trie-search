const doneResult: IteratorReturnResult<string> = { value: "", done: true };

export type CreateCharacterIteratorOptions = {
  caseInsensitive?: boolean;
};

export const createCharacterIterator = (value: string, options?: CreateCharacterIteratorOptions): Iterator<string> => {
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

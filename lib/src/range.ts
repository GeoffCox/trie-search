/**
 * A specified start,end and length to identify range of items in a linear sequence.
 * Most of used to identify a range of characters or tokens in text.
 */
export type Range = {
  /**
   * The start position of the range.
   */
  start: number;
  /**
   * The length of the range.
   */
  length: number;
  /**
   * The end position of the range.
   */
  end: number;
};

/**
 * Formats a range as a string. Typically used in debugging.
 */
export const rangeToString = <T extends Range>(range: Partial<T>): string => {
  const startText = range?.start ?? "";
  const endText = range?.end ?? "";
  const lengthText = range?.length ?? "";
  return `[${startText}..${endText}](${lengthText})`;
};

/**
 * Creates a range from a partial range.
 */
export const createRange = <T extends Range>(range: Partial<T>): T => {
  const { start, end, length, ...rest } = range;

  if (start !== undefined) {
    if (start < 0) {
      throw new Error(`The range start is negative. ${rangeToString(range)}`);
    }
  }

  if (end !== undefined && end < 0) {
    throw new Error(`The range end is negative. ${rangeToString(range)}`);
  }

  if (length !== undefined && length < 0) {
    throw new Error(`The range length is negative. ${rangeToString(range)}`);
  }

  if (start !== undefined && end !== undefined && start > end) {
    throw new Error(`The range start is greater than end. ${rangeToString(range)}`);
  }

  if (start !== undefined && end !== undefined && length !== undefined && length !== end - start) {
    throw new Error(`The range length doesn't equal end minus start. ${rangeToString(range)}`);
  }

  if (start !== undefined && end !== undefined && length !== undefined) {
    // start, end, length
    return {
      ...rest,
      start,
      end,
      length,
    } as T;
  } else if (start !== undefined && end !== undefined) {
    // start, end
    return {
      ...rest,
      start,
      end,
      length: end - start,
    } as T;
  } else if (start !== undefined && length !== undefined) {
    // start, length
    return {
      ...rest,
      start,
      end: start + length,
      length,
    } as T;
  } else if (start !== undefined) {
    // start
    return {
      ...rest,
      start,
      end: start,
      length: 0,
    } as T;
  } else if (end !== undefined && length !== undefined) {
    // end, length
    return {
      ...rest,
      start: end - length,
      end,
      length,
    } as T;
  } else if (end !== undefined) {
    // end
    return {
      ...rest,
      start: end,
      end,
      length: 0,
    } as T;
  } else if (length !== undefined) {
    // length
    return {
      ...rest,
      start: 0,
      end: length,
      length,
    } as T;
  }

  // (empty)
  return {
    ...rest,
    start: 0,
    end: 0,
    length: 0,
  } as T;
};

/**
 * Returns true if the range start, end, and length are valid; false otherwise.
 */
export const isRangeValid = <T extends Range>(range: T): boolean => {
  if (range === undefined) {
    return false;
  }

  const { start, end, length } = range;

  return (
    start !== undefined &&
    end !== undefined &&
    length !== undefined &&
    start >= 0 &&
    end >= 0 &&
    length >= 0 &&
    start <= end &&
    length === end - start
  );
};

/**
 * Validates the range is valid. Throws errors if range is invalid.
 */
export const validateRange = <T extends Range>(range: T) => {
  if (range === undefined) {
    throw new Error(`The range is undefined. ${rangeToString(range)}`);
  }
  const { start, end, length } = range;

  if (start === undefined) {
    throw new Error(`The range start is undefined. ${rangeToString(range)}`);
  }
  if (end === undefined) {
    throw new Error(`The range end is undefined. ${rangeToString(range)}`);
  }
  if (length === undefined) {
    throw new Error(`The range length is undefined. ${rangeToString(range)}`);
  }
  if (start < 0) {
    throw new Error(`The range start is negative. ${rangeToString(range)}`);
  }
  if (end < 0) {
    throw new Error(`The range end is negative. ${rangeToString(range)}`);
  }
  if (length < 0) {
    throw new Error(`The range length is negative. ${rangeToString(range)}`);
  }

  if (length !== end - start) {
    throw new Error(`The range length does not equal end minus start. ${rangeToString(range)}`);
  }
};

/**
 * Returns true if the two ranges start, and, and length are equal; false otherwise.
 */
export const rangesEqual = <T extends Range>(x: T, y: T): boolean => {
  validateRange(x);
  validateRange(y);
  return x.start === y.start && x.end === y.end && x.length === y.length;
};

/**
 * Returns true if the first range contains the other range; false otherwise.
 */
export const rangeContains = <T extends Range>(range: T, other: T): boolean => {
  validateRange(range);
  validateRange(other);
  return range.start <= other.start && range.end >= other.end;
};

/**
 * Returns true if the two ranges overlap; false otherwise.
 */
export const rangesOverlap = <T extends Range>(x: T, y: T): boolean => {
  validateRange(x);
  validateRange(y);
  // a single length range has start of N and end of N+1 so I use < and >
  return x.end > y.start && x.start < y.end;
};

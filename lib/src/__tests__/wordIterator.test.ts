import { createWordIterator, createWordIteratorRanges } from "../wordIterator";

describe("createWordIterator", () => {
  it("returns iterator of words", () => {
    const text = "The quick brown fox jumped over the lazy dog.";
    const expected = ["The", "quick", "brown", "fox", "jumped", "over", "the", "lazy", "dog", "."];
    const actual = createWordIterator(text);

    expect(actual).toBeDefined();

    let i = 0;
    let word = actual.next();
    while (!word.done) {
      expect(word.value).toEqual(expected[i]);
      word = actual.next();
      i++;
    }

    expect(i).toEqual(10);
  });
  it("returns iterator of words with spaces", () => {
    const text = "The quick brown fox jumped over the lazy dog.";
    const expected = [
      "The",
      " ",
      "quick",
      " ",
      "brown",
      " ",
      "fox",
      " ",
      "jumped",
      " ",
      "over",
      " ",
      "the",
      " ",
      "lazy",
      " ",
      "dog",
      ".",
    ];
    const actual = createWordIterator(text, { includeWhitespace: true });

    expect(actual).toBeDefined();

    let i = 0;
    let word = actual.next();
    while (!word.done) {
      expect(word.value).toEqual(expected[i]);
      word = actual.next();
      i++;
    }

    expect(i).toEqual(18);
  });
});

describe("createWordIteratorRanges", () => {
  it("returns ranges", () => {
    const text = "The quick brown fox jumped over the lazy dog.";
    const expected = ["The", "quick", "brown", "fox", "jumped", "over", "the", "lazy", "dog", "."];
    const actual = createWordIteratorRanges(text);

    expect(actual).toBeDefined();
    expect(actual.length).toEqual(10);

    for (let i = 0; i < actual.length; i++) {
      expect(text.substring(actual[i].start, actual[i].end)).toEqual(expected[i]);
    }
  });
});

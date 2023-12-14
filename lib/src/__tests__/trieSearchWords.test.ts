import { trieSearchWords } from "../trieSearchApi";
import { constitution } from './constitution';

describe("trieSearchWords", () => {
  it("finds single phrase at start", () => {
    const text = "The quick brown fox jumps over the lazy dog.";
    const searchFor = ["The quick brown"];
    const actual = trieSearchWords(text, {}, ...searchFor);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toEqual({ searchIndex: 0, start: 0, end: 3, length: 3 });
  });
  it("finds multiple independent phrases", () => {
    const text = "The quick brown fox jumps over the lazy dog.";
    const searchFox = "quick brown fox";
    const searchDog = "lazy dog";
    const actual = trieSearchWords(text, {}, searchFox, searchDog);

    // Expect searchFox to be found at [4,19) and searchDog to be found at [35,43)
    // [0]: { searchId: 0, start: 4, end: 19, length: 15}
    // [1]: { searchId: 1, start: 35, end: 43, length: 8}

    expect(actual.length).toEqual(2);
    expect(actual[0]).toEqual({ searchIndex: 0, start: 1, end: 4, length: 3 });
    expect(actual[1]).toEqual({ searchIndex: 1, start: 7, end: 9, length: 2 });
  });
  it("finds single phrase at start of constitution", () => {
    const text = constitution;
    const searchFor = ["We the people"];
    const actual = trieSearchWords(text, { caseInsensitive: true}, ...searchFor);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toEqual({ searchIndex: 0, start: 0, end: 3, length: 3 });
  });
});

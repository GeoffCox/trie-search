export type Tokenizer<T> = {
  getToken: () => T | undefined;
};

export const createCharacterTokenizer = (value: string) => {
  let i = 0;

  const getToken = () => {
    if (i < value.length) {
      const result = value[i];
      i++;
      return result;
    }
    return undefined;
  };

  return {
    getToken,
  };
};

const delimiters = [
  " ",
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

export const createWordTokenizer = (value: string) => {
  let i = 0;

  const getToken = () => {
    if (i < value.length) {
      let t = i;
      while (t < value.length && delimiters.includes(value[t]!)) {
        t++;
      }
      t++;
      const token = value.slice(i, t);
      i = t;
      return token;
    }
    return undefined;
  };

  return {
    getToken,
  };
};

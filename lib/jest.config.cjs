/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  testRegex: "/src/__tests__/.+\\.test\\.ts$",  //lib/src/__tests__/trieSearchWords.test.ts
};
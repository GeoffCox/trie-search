/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
};
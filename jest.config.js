/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageReporters: ["json-summary", "text", "lcov"],
  modulePathIgnorePatterns: ["./dist"],

  // This is necessary or the tests won't run
  resetMocks: false,
  setupFiles: ["jest-localstorage-mock"],
};

module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 50,
      functions: 90,
      lines: 90
    }
  }
}

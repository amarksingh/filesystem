module.exports = {
    testEnvironment: "node",
    testMatch: ["**/test/**/*.test.js"],
    transform: {},
    moduleNameMapper: {
        "^@ostro/support/(.*)$": "<rootDir>/../support/$1",
        "^@ostro/support$": "<rootDir>/../support",
        "^@ostro/contracts/(.*)$": "<rootDir>/../contracts/$1",
        "^@ostro/contracts$": "<rootDir>/../contracts",
        "^@ostro/filesystem/(.*)$": "<rootDir>/$1",
        "^@ostro/filesystem$": "<rootDir>/filesystemManager.js"
    },
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "clover"],
    collectCoverageFrom: [
        "<rootDir>/*.js",
        "<rootDir>/adapter/**/*.js",
        "<rootDir>/clients/**/*.js",
        "!<rootDir>/jest.config.js"
    ]
};

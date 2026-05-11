================================================================================
PAWCONNECT - UNIT TESTS
================================================================================

WHAT THESE TESTS ARE
  Unit tests exercise src/lib/pawApi.js in Node without starting the Express
  server and without connecting to MongoDB. They use an in-memory localStorage
  stub and force fetch to fail so the client data layer uses local/mock paths.

WHERE THE TEST CODE LIVES
  tests/unit/pawApi.test.js

HOW TO RUN (from the project root directory)
  npm run test:unit

  The npm script sets VITE_DATA_MODE=hybrid so src/lib/pawApi.js exercises API-first
  paths with local fallback (matching how these tests were written). Equivalent:

  cross-env NODE_ENV=test VITE_DATA_MODE=hybrid NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.unit.mjs --runInBand

PREREQUISITES
  - Node.js 18+ and npm
  - Run npm install once in the project root
  - You do NOT need .env.test, JWT_SECRET, or MongoDB for this suite.

CONFIGURATION
  jest.config.unit.mjs at the project root selects only tests/unit/**/*.test.js
  and does not load the integration MongoDB setup file.

================================================================================

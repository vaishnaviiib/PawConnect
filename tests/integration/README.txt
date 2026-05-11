================================================================================
PAWCONNECT - INTEGRATION TESTS
================================================================================

WHAT THESE TESTS ARE
  Integration tests call the real Express app (app.js) over HTTP using
  Supertest, hit real route handlers, and persist data to MongoDB through
  Mongoose. They verify auth, dogs, and applications APIs together with the
  database.

WHERE THE TEST CODE LIVES
  tests/integration/auth.test.js
  tests/integration/dogs.test.js
  tests/integration/applications.test.js

  Shared lifecycle (connect, clear collections between tests, drop DB after):
  tests/integration/setup.js

HOW TO RUN (from the project root directory)
  npm run test:integration

  Equivalent command:
  cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.integration.mjs --runInBand

  To run the full suite (unit tests then integration tests):
  npm test

PREREQUISITES
  - Node.js 18+ and npm
  - Run npm install once in the project root
  - MongoDB running and reachable
  - Copy .env.test.example to .env.test in the project root
  - Set MONGO_URI or MONGO_URL to a dedicated test database (never production)
  - Set JWT_SECRET in .env.test (any non-empty string is fine for tests)

OPTIONAL
  MONGO_DB_NAME in .env.test overrides the database name (default pawlink_test
  is applied in setup.js if unset).

WARNING
  tests/integration/setup.js deletes all documents after each test case and
  drops the entire database after the suite finishes. Use only a disposable
  test database.

================================================================================

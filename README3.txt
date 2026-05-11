PawConnect - Basic Function Testing

Overview
This project uses Jest. Integration tests use Supertest against the Express app
and a separate MongoDB test database. Unit tests exercise src/lib/pawApi.js
in Node with mocked fetch and localStorage (no MongoDB).

Files Included - Integration (MongoDB + HTTP)
- tests/integration/setup.js
- tests/integration/auth.test.js
- tests/integration/dogs.test.js
- tests/integration/applications.test.js

Files Included - Unit
- tests/unit/pawApi.test.js

Per-suite instructions
- tests/unit/README.txt - how to run unit tests only
- tests/integration/README.txt - how to run integration tests only

Requirements for integration tests
- Node.js installed
- npm installed
- MongoDB test database created
- .env.test file created in the project root

Requirements for unit tests
- Node.js and npm only (after npm install). No .env.test or MongoDB required.

Example .env.test (integration only)
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=PawLink_Tests
JWT_SECRET=testsecret123
PORT=5002
NODE_ENV=test

How to Run - Unit tests only
  npm run test:unit

How to Run - Integration tests only
  Ensure .env.test contains the correct MongoDB test database connection and JWT_SECRET.
  npm run test:integration

How to Run - Full suite (unit then integration)
  npm test

What the Tests Cover
1. Auth API (integration)
- register a new user
- reject duplicate email registration
- log in an existing user
- return the current authenticated user
- reject unauthenticated access to protected auth routes

2. Dogs API (integration)
- return dog listings
- allow shelters to create dogs
- reject dog creation from adopters
- filter dogs by breed, size, and age range
- allow shelters to update and delete their own dogs

3. Applications API (integration)
- allow adopters to apply for a dog
- prevent duplicate applications for the same dog
- allow adopters and shelters to view the correct applications
- allow shelters to approve an application
- reject unauthorized application creation

4. Client pawApi module (unit)
- local dog profiles, applications, visits, notifications, and getDogs merge behavior
  when the network is unavailable (see tests/unit/pawApi.test.js).

Expected Result
When the tests run successfully, Jest reports that all test suites and tests have passed.

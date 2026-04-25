PawConnect - Basic Function Testing

Overview
This project uses Jest and Supertest to run basic backend API tests for the main PawConnect features. The tests use a separate MongoDB test database so they do not interfere with the main project data.

Files Included
- tests/setup.js
- tests/auth.test.js
- tests/dogs.test.js
- tests/applications.test.js

Requirements
- Node.js installed
- npm installed
- MongoDB test database created
- .env.test file created in the project root

Example .env.test
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=PawLink_Tests
JWT_SECRET=testsecret123
PORT=5002
NODE_ENV=test

How to Run the Tests
1. Open a terminal in the project folder.
2. Make sure the .env.test file contains the correct MongoDB test database connection.
3. Run:

npm test

What the Tests Cover
1. Auth API
- register a new user
- reject duplicate email registration
- log in an existing user
- return the current authenticated user
- reject unauthenticated access to protected auth routes

2. Dogs API
- return dog listings
- allow shelters to create dogs
- reject dog creation from adopters
- filter dogs by breed, size, and age range
- allow shelters to update and delete their own dogs

3. Applications API
- allow adopters to apply for a dog
- prevent duplicate applications for the same dog
- allow adopters and shelters to view the correct applications
- allow shelters to approve an application
- reject unauthorized application creation

Expected Result
When the tests run successfully, Jest reports that all test suites and tests have passed.

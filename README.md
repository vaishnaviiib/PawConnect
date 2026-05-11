README.TXT
=======================================

PawConnect
========================================

PawConnect is a full-stack web application for connecting adopters, foster families, and animal shelters. The project includes:

- A React 19 front-end client built with Vite
- An Express 5 REST API
- MongoDB database integration using Mongoose
- JWT-based user authentication

The software runs using Node.js and a web browser. There is no standalone executable file.


SECTION 1 — File Inventory
==================================================

ROOT FILES

app.js
- Main Express application setup including middleware, routes, and error handling.

server.js
- Starts the Express server, loads environment variables, connects to MongoDB, and listens on the configured port.

package.json
- Contains npm scripts, project metadata, and dependency information.

package-lock.json
- Locked dependency versions used by npm.

vite.config.js
- Configuration for the Vite development server and API proxy.

eslint.config.js
- ESLint configuration for code quality and formatting.

index.html
- Main HTML entry point used by the React application.

.gitignore
- Git ignore rules for generated files and sensitive files.

.env.example
- Example environment variables for development.

.env.test.example
- Example environment variables for Jest testing.

README.md
- Markdown documentation for the project.

README3.txt
- Additional notes about running automated tests.

README.txt
- This file.


Config Folder
--------------------------------------------------

config/db.js
- MongoDB connection helper used during server startup.


Controllers
--------------------------------------------------

controllers/applicationController.js
- Placeholder controller file for application logic.

controllers/authController.js
- Handles user registration, login, and token generation.

controllers/dogController.js
- Placeholder controller file for dog logic.


Middleware
--------------------------------------------------

middleware/authMiddleware.js
- JWT authentication and role authorization middleware.


Models
--------------------------------------------------

models/Application.js
- Mongoose schema for adoption and foster applications.

models/Dog.js
- Mongoose schema for dog listings and status information.

models/User.js
- Mongoose schema for user accounts and password hashing.


Routes
--------------------------------------------------

routes/applicationRoutes.js
- API routes for application CRUD operations.

routes/authRoutes.js
- API routes for login, registration, and user authentication.

routes/dogRoutes.js
- API routes for dog listings and management.


Public Assets
--------------------------------------------------

public/favicon.svg
- Browser favicon image.

public/icons.svg
- Shared SVG icon assets used in the UI.


React Source Files
--------------------------------------------------

src/App.jsx
- Root React component and routing setup.

src/App.css
- Main application layout styles.

src/PawConnect.css
- Global branding and layout styles.

src/index.css
- Global CSS styles.

src/main.jsx
- React DOM entry point.

src/lib/pawApi.js
- Client-side API utility and mock data handler.


Image Assets
--------------------------------------------------

src/assets/cat.png
- UI image asset.

src/assets/hero.png
- Homepage hero image.

src/assets/react.svg
- React logo.

src/assets/vite.svg
- Vite logo.


Components
--------------------------------------------------

src/components/BottomNav/BottomNav.jsx
- Bottom navigation component.

src/components/BottomNav/BottomNav.css
- Styles for bottom navigation.

src/components/Button/Button.jsx
- Reusable button component.

src/components/Button/Button.css
- Button styles.

src/components/InputField/InputField.jsx
- Reusable form input component.

src/components/InputField/InputField.css
- Input field styles.

src/components/PhoneLayout/PhoneLayout.jsx
- Mobile-style layout wrapper.

src/components/PhoneLayout/PhoneLayout.css
- Styles for phone layout wrapper.


Mock Data
--------------------------------------------------

src/mockData/applications.js
- Mock application records.

src/mockData/dogs.js
- Mock dog listing data.

src/mockData/notifications.js
- Mock notification data.

src/mockData/shelterApplications.js
- Mock shelter application data.

src/mockData/shelterAppointments.js
- Mock appointment data.

src/mockData/shelterDogs.js
- Mock shelter-owned dog data.

src/mockData/shelters.js
- Mock shelter information.


Pages
--------------------------------------------------

src/pages/ApplicationForm/
- Dog application submission page.

src/pages/Applications/
- User applications page.

src/pages/BrowseDogs/
- Browse available dogs page.

src/pages/CreateDogProfile/
- Shelter dog creation page.

src/pages/DogProfile/
- Individual dog details page.

src/pages/Login/
- User login page.

src/pages/ManageAppointments/
- Shelter appointment management page.

src/pages/Notifications/
- Notifications page.

src/pages/Profile/
- User profile page.

src/pages/ReviewApplications/
- Shelter application review page.

src/pages/ScheduleVisit/
- Appointment scheduling page.

src/pages/ShelterDashboard/
- Shelter dashboard page.

src/pages/SignUp/
- User registration page.

Each page folder contains:
- A .jsx file for page logic
- A .css file for styling


Tests
--------------------------------------------------

jest.config.unit.mjs
- Jest configuration for unit tests only.

jest.config.integration.mjs
- Jest configuration for integration tests (loads MongoDB setup).

tests/unit/README.txt
- How to run unit tests.

tests/unit/pawApi.test.js
- Unit tests for client API utility behavior (mocked fetch and localStorage).

tests/integration/README.txt
- How to run integration tests.

tests/integration/setup.js
- Jest setup: loads .env.test, connects MongoDB, clears data between tests, drops test DB after suite.

tests/integration/auth.test.js
- Integration tests for authentication routes.

tests/integration/dogs.test.js
- Integration tests for dog API routes.

tests/integration/applications.test.js
- Integration tests for application API routes.


SECTION 2 — Prerequisites and Installation
==================================================

REQUIRED SOFTWARE

- Node.js version 18 or newer
- npm (included with Node.js)
- MongoDB database connection

INSTALL DEPENDENCIES

Open a terminal in the project root directory and run:

npm install

This installs all required packages listed in package.json.


SECTION 3 — How to Build the Software
==================================================

This project uses JavaScript and does not compile into a native executable.

BUILD THE REACT CLIENT

Run:

npm run build

This creates a production-ready dist/ folder containing optimized HTML, CSS, and JavaScript files.

EXPRESS API

The API does not require a separate build step.

Run the server directly using:

node server.js


SECTION 4 — Where to Find the Runnable Output
==================================================

There is no .exe or standalone executable included.

MAIN SERVER FILE

server.js

Run using:

node server.js

or

npm start

BUILT FRONT-END FILES

After running:

npm run build

the production-ready files are located in:

dist/


SECTION 5 — How to Run the Sofware
==================================================

STEP 1 — CONFIGURE ENVIRONMENT VARIABLES

Copy .env.example to .env

Required variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

STEP 2 — START THE API SERVER

Open a terminal in the project root and run:

npm run dev:server

This starts the Express API using Nodemon.

Default API URL:

http://localhost:5000

STEP 3 — START THE REACT CLIENT

Open a second terminal and run:

npm run dev:client

Default Vite client URL:

http://localhost:5173

Open this URL in a web browser.

AUTOMATED TESTS (run from project root; optional during development)

Unit tests (no MongoDB; npm sets VITE_DATA_MODE=hybrid for Jest):
  npm run test:unit
  See tests/unit/README.txt and jest.config.unit.mjs.

Integration tests (HTTP + MongoDB; requires .env.test with MONGO_URI or MONGO_URL and JWT_SECRET):
  npm run test:integration
  See tests/integration/README.txt and jest.config.integration.mjs.
  Setup file tests/integration/setup.js clears data between tests and drops the test database after the suite.

Full suite (unit tests, then integration tests):
  npm test

SECTION 6 — User Authentication
==================================================

Many features require users to log in.

There are no preloaded users included with the project.

Users must register first using:
- The Sign Up page in the application
- OR the /auth/register API endpoint

EXAMPLE LOGIN CREDENTIALS

Email: adopter@example.com
Password: password123

These credentials only work if the user exists in the connected MongoDB database.

REGISTRATION REQUIREMENTS

Required fields:
- name
- email
- phone
- password
- role

Allowed role values:
- adopter
- foster
- shelter

Password requirements:
- Minimum length of 6 characters


SECTION 7 — Runtime Parameters and Configuration
==================================================

ENVIRONMENT VARIABLES

MONGO_URI
- MongoDB database connection string

Example:
mongodb://127.0.0.1:27017/pawconnect

JWT_SECRET
- Secret key used for JWT token generation and verification
- Must be a non-empty string
- Required for server startup

PORT
- Port number used by the Express server
- Default value: 5000
- Allowed values: Any valid positive integer port number

VITE_DATA_MODE
- Controls how the front-end loads data

Allowed values:
- mock
- api
- hybrid

Descriptions:
- mock = Uses local mock data
- api = Uses API-only mode
- hybrid = Uses API with mock fallback

VITE_API_URL
- Optional API base URL

Example:
http://127.0.0.1:5000

VITE_API_BASE_URL
- Alternative API base URL variable checked by the client


SECTION 8 — Available npm Commands
==================================================

npm run dev:client
- Starts the Vite React development server

npm run dev:server
- Starts the Express server with Nodemon

npm start
- Runs node server.js

npm run build
- Creates the production dist/ folder

npm run preview
- Serves the built dist/ folder locally

npm run lint
- Runs ESLint checks

npm run test:unit
- Runs Jest unit tests only (no MongoDB)

npm run test:integration
- Runs Jest integration tests (requires .env.test and MongoDB)

npm test
- Runs unit tests then integration tests (full Jest suite)


SECTION 9 — API Parameters
==================================================
GET /dogs OPTIONAL QUERY PARAMETERS

page
- Integer greater than or equal to 1

limit
- Integer between 1 and 100

minAge
- Non-negative number

maxAge
- Non-negative number

breed
- String value

size
- Allowed values:
  Small
  Medium
  Large
  Extra Large

location
- String value

adoptionType
- Allowed values:
  Adoption
  Foster
  Both

status
- Allowed values:
  Available
  Pending
  Adopted
  Fostered


Application Model Parameters
--------------------------------------------------
applicationType
- Adoption
- Foster

status
- Pending
- Approved
- Rejected


User Role Parameters
--------------------------------------------------
role
- adopter
- foster
- shelter

================================================================================
PAWCONNECT - README.TXT
================================================================================

PawConnect is a full-stack web application: a React 19 single-page client
(bundled with Vite 8) and an Express 5 REST API backed by MongoDB (Mongoose).
There is no native compiled executable and no command-line arguments to the
server; configuration is via environment variables. Running the software means
starting the API with Node.js and opening the client in a web browser (Vite
dev server or static files from dist/).

================================================================================
SECTION 1 - FILE INVENTORY (ALL PROJECT FILES AND BRIEF DESCRIPTIONS)
================================================================================
--- Root and configuration ---
.env.example - Sample environment variables for local API and Vite (copy to .env).
.env.test.example - Sample variables for Jest; copy to .env.test.
.gitignore - Git ignore rules (node_modules, .env, dist, etc.).
README.md - Markdown project documentation (prerequisites, run, tests).
README3.txt - Plain-text notes focused on running Jest API tests.
README.txt - This plain-text guide (file list, build, run, auth, parameters).
app.js - Express application: middleware, route mounts, 404 and error handlers.
eslint.config.js - ESLint flat config for the repo.
index.html - Vite HTML shell; entry for the React client.
package.json - npm metadata, scripts, and dependency lists.
package-lock.json - Locked dependency versions for reproducible npm installs.
server.js - API process entry: loads .env, validates JWT_SECRET, connects DB, listens on PORT.
vite.config.js - Vite config: React plugin, dev server proxy to Express on PORT.

--- config ---
config/db.js - MongoDB connection helper used by server startup.

--- controllers ---
controllers/applicationController.js - Placeholder file (empty); application HTTP logic is in routes/applicationRoutes.js.
controllers/authController.js - Register, login, token generation, /auth/me responses.
controllers/dogController.js - Placeholder file (empty); dog HTTP logic is in routes/dogRoutes.js.

--- middleware ---
middleware/authMiddleware.js - JWT verification (protect) and role checks (authorizeRoles).

--- models ---
models/Application.js - Mongoose schema for adoption/foster applications.
models/Dog.js - Mongoose schema for dog listings (enums for size, adoptionType, status).
models/User.js - Mongoose schema for users (adopter/shelter roles, password hashing).

--- routes ---
routes/applicationRoutes.js - REST routes for applications (CRUD, role guards).
routes/authRoutes.js - REST routes for /auth/register, /auth/login, /auth/me.
routes/dogRoutes.js - REST routes for dogs: list, get by id, create/update/delete for shelters.

--- public (static assets served by Vite) ---
public/favicon.svg - Favicon image.
public/icons.svg - SVG icon sprite or shared icons for the UI.

--- src (React client source) ---
src/App.css - Top-level styles for App layout.
src/App.jsx - Root React component: routing and page shell.
src/PawConnect.css - Global PawConnect branding/layout styles.
src/index.css - Global base styles.
src/main.jsx - React DOM root mount and StrictMode.
src/lib/pawApi.js - Client API and mock/hybrid/api data mode; localStorage helpers.

--- src/assets ---
src/assets/cat.png - Raster image asset used in the UI.
src/assets/hero.png - Hero/banner image asset.
src/assets/react.svg - React logo asset.
src/assets/vite.svg - Vite logo asset.

--- src/components ---
src/components/BottomNav/BottomNav.css - Styles for bottom navigation.
src/components/BottomNav/BottomNav.jsx - Mobile-style bottom navigation component.
src/components/Button/Button.css - Button styles.
src/components/Button/Button.jsx - Reusable button component.
src/components/InputField/InputField.css - Form input styles.
src/components/InputField/InputField.jsx - Reusable input component.
src/components/PhoneLayout/PhoneLayout.css - Phone-frame layout styles.
src/components/PhoneLayout/PhoneLayout.jsx - Phone-shaped layout wrapper.

--- src/mockData ---
src/mockData/applications.js - Mock application records for demo/offline mode.
src/mockData/dogs.js - Mock dog listings and image URLs for mock mode.
src/mockData/notifications.js - Mock notification items.
src/mockData/shelterApplications.js - Mock shelter-side applications.
src/mockData/shelterAppointments.js - Mock appointment data for shelter flows.
src/mockData/shelterDogs.js - Mock dogs owned by shelter personas.
src/mockData/shelters.js - Mock shelter directory data.

--- src/pages ---
src/pages/ApplicationForm/ApplicationForm.css - Styles for the application form page.
src/pages/ApplicationForm/ApplicationForm.jsx - Page to submit an application for a dog.
src/pages/Applications/Applications.css - Styles for adopter applications list.
src/pages/Applications/Applications.jsx - Page listing the current user's applications.
src/pages/BrowseDogs/BrowseDogs.css - Styles for dog browse grid/list.
src/pages/BrowseDogs/BrowseDogs.jsx - Page to browse available dogs.
src/pages/CreateDogProfile/CreateDogProfile.css - Styles for creating a dog profile.
src/pages/CreateDogProfile/CreateDogProfile.jsx - Shelter page to add a new dog.
src/pages/DogProfile/DogProfile.css - Styles for single dog detail view.
src/pages/DogProfile/DogProfile.jsx - Dog detail page.
src/pages/Login/Login.css - Login page styles.
src/pages/Login/Login.jsx - Login page (email and password).
src/pages/ManageAppointments/ManageAppointments.css - Appointment management styles.
src/pages/ManageAppointments/ManageAppointments.jsx - Shelter appointment management UI.
src/pages/Notifications/Notifications.css - Notifications page styles.
src/pages/Notifications/Notifications.jsx - Notifications list page.
src/pages/Profile/Profile.css - User profile styles.
src/pages/Profile/Profile.jsx - Profile view/edit page.
src/pages/ReviewApplications/ReviewApplications.css - Styles for shelter application review.
src/pages/ReviewApplications/ReviewApplications.jsx - Shelter page to review applications.
src/pages/ScheduleVisit/ScheduleVisit.css - Schedule visit page styles.
src/pages/ScheduleVisit/ScheduleVisit.jsx - Page to schedule a visit (demo flow).
src/pages/ShelterDashboard/ShelterDashboard.css - Shelter dashboard styles.
src/pages/ShelterDashboard/ShelterDashboard.jsx - Shelter home/dashboard page.
src/pages/SignUp/SignUp.css - Registration page styles.
src/pages/SignUp/SignUp.jsx - Sign-up page (name, email, phone, password, role).

--- tests ---
tests/applications.test.js - Jest/Supertest tests for application API routes.
tests/auth.test.js - Jest/Supertest tests for authentication routes.
tests/dogs.test.js - Jest/Supertest tests for dog API routes.
tests/frontend/pawApi.test.js - Jest tests for client pawApi module behavior.
tests/setup.js - Jest setup: loads .env.test, connects Mongo, clears data between tests, drops test DB after suite.

================================================================================
SECTION 2 - PREREQUISITES AND INSTALL
================================================================================

Prerequisites:
  - Node.js 18 or newer
  - npm (comes with Node.js)
  - MongoDB reachable at the URI you put in .env (for API and tests)

Install dependencies (from the project root directory):

  npm install

This downloads all packages listed in package.json into node_modules/ (not
tracked in git).

================================================================================
SECTION 3 - HOW TO COMPILE / BUILD A RUNNABLE RESULT
================================================================================

This project is JavaScript. Nothing is compiled to a single machine binary.

1) Client (production static site)
   Command:  npm run build
   Tool:     Vite bundles the React app.
   Output:   Folder named "dist/" in the project root containing HTML, JS, and
             CSS assets ready to be served by any static file host.

2) API (Express server)
   Command:  none required before run (no separate compile step).
   Runtime:  Node executes server.js directly (ES modules: "type": "module" in
             package.json).

================================================================================
SECTION 4 - WHERE TO FIND THE "EXECUTABLE" / BUILT OUTPUT
================================================================================

No standalone executable (.exe, etc.) is included in the repository.

- API entry file:     server.js  (run with: node server.js)
- npm convenience:    npm start  runs: node server.js
- Built client files: dist/      (created only after: npm run build)

The React app in the browser is not a separate file you double-click; it loads
from the Vite dev server during development or from dist/ in production.

================================================================================
SECTION 5 - HOW TO RUN THE SOFTWARE (NO COMMAND-LINE PARAMETERS)
================================================================================

The server does not read argv flags. All runtime tuning is via environment
variables (see Section 6).

--- A) Local development: two terminals, same project root ---

Before first run, copy .env.example to .env and set at least:
  JWT_SECRET   (required or the server throws on startup)
  MONGO_URI    (MongoDB connection string; required for a working database)

Terminal 1 - API:
  npm run dev:server
  This runs nodemon server.js. Express listens on PORT from .env (default 5000).

Terminal 2 - Client:
  npm run dev:client
  This runs Vite. By default the dev server is at:
    http://localhost:5173
  (Vite default port 5173; if that port is busy, Vite prints the actual URL.)

  Vite proxies these paths to http://127.0.0.1:<PORT> (PORT from .env, default 5000):
    /auth
    /dogs
    /applications

Open the printed local URL in a web browser.

================================================================================
SECTION 6 - AUTHENTICATION AND EXAMPLE CREDENTIALS
================================================================================

User authentication is required for many API actions and for logged-in UI flows.
There are NO pre-seeded demo users shipped with the app. You must create a user
first.

Ways to create a user:
  - Use the Sign Up page in the web UI, or
  - POST /auth/register with JSON body (see registration rules below).

Login uses EMAIL as the identifier (not a numeric user id in the UI). Password
must match the stored hash for that email.

Example credentials that appear in the automated test file tests/auth.test.js:
  Email:    adopter@example.com
  Password: password123

These ONLY work if that user already exists in the same MongoDB database you
are using (for example, you registered manually with exactly that email and
password, or you ran tests that created the user before you try to log in).
The test suite clears collections between tests and drops the test database at
the end, so do not assume this account persists after npm test unless you use a
non-test database and create the user yourself.

Registration (POST /auth/register or Sign Up form) required fields:
  name, email, phone, password, role

Allowed values:
  role: must be exactly one of:  adopter  |  shelter
  password: minimum 6 characters (see models/User.js)

================================================================================
SECTION 7 - ALL PARAMETERS / CONFIGURATION VALUES AT RUN TIME
================================================================================

7a) Main application .env (copy from .env.example)

Variable: MONGO_URI
  Meaning:  MongoDB connection URI for the API.
  Allowed:  Any valid MongoDB connection string (e.g. mongodb://127.0.0.1:27017/pawlink).
  Required: Needed for database operations when the server connects successfully.

Variable: JWT_SECRET
  Meaning:  Secret key used to sign and verify JSON Web Tokens.
  Allowed:  Any non-empty string; use a long random value in production.
  Required: Yes. server.js throws if JWT_SECRET is missing.

Variable: PORT
  Meaning:  TCP port for Express to listen on.
  Allowed:  Positive integer (typical 1024-65535). Default if unset: 5000.
  Note:     Should match the port Vite proxies to when using npm run dev:client.

Variable: VITE_DATA_MODE
  Meaning:  How the React client loads data (see src/lib/pawApi.js). Compared
            case-insensitively after lowercasing.
  Allowed values:
    mock    - Client uses bundled mock data by default; full offline-friendly demos.
    api     - Client uses API-only mode where enforced (no mock fallback for those paths).
    hybrid  - Recommended label for "not mock-only and not api-only": tries API
              where applicable and can fall back to local/mock data when not in
              strict API-only mode.
    (any other non-empty string) - Treated like hybrid (neither MOCK_ONLY nor API_ONLY).

  If unset, the client behaves like mock (code default in pawApi.js).

Variable: VITE_API_URL  (optional)
  Meaning:  Base URL for direct HTTP calls to the API when not using the Vite
            dev server proxy (e.g. preview or custom hosting).

Variable: VITE_API_BASE_URL (optional)
  Meaning:  Same family as VITE_API_URL; pawApi.js checks both; first wins.

  Allowed for URL vars: Full origin including scheme and host, e.g.
    http://127.0.0.1:5000

7b) Jest tests .env.test (copy from .env.test.example)

Variable: MONGO_URI or MONGO_URL
  Meaning:  MongoDB URI for tests.
  Required: Yes; tests/setup.js throws if missing.

Variable: JWT_SECRET
  Meaning:  Secret for tokens during tests.
  Required: Effectively yes for any auth-related tests.

Variable: MONGO_DB_NAME (optional)
  Meaning:  Database name; default in tests/setup.js is pawlink_test.

Warning: tests/setup.js deletes all documents after each test and calls
dropDatabase() after the suite finishes. Use a dedicated test database only.

7c) npm scripts (no extra arguments required by these projects)

  npm run dev:client   - starts Vite (no script-specific CLI parameters).
  npm run dev:server   - starts nodemon on server.js.
  npm start            - node server.js
  npm run build        - vite build
  npm run preview      - vite preview (serves dist/)
  npm run lint         - eslint .
  npm test             - jest --runInBand with NODE_ENV=test

7d) HTTP API - GET /dogs query parameters (optional reference)

  page:    integer >= 1 (default 1 if invalid/low).
  limit:   integer clamped between 1 and 100 (default 20).
  minAge, maxAge: non-negative numbers; minAge must not exceed maxAge if both set.
  breed, size, location, adoptionType, status: optional string filters passed to MongoDB.

  For stored dog documents, enums in models/Dog.js:
    size:          Small | Medium | Large | Extra Large
    adoptionType:  Adoption | Foster | Both
    status:        Available | Pending | Adopted | Fostered

7e) HTTP API - applications (models/Application.js)

  applicationType: Adoption | Foster
  status:          Pending | Approved | Rejected

7f) User role (models/User.js and auth)

  role: adopter, foster, or shelter


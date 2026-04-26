README3.txt

Frontend Basic Function Testing

This frontend test suite covers the client-side shelter and adopter workflow logic in `src/lib/pawApi.js`.
The tests verify that the app can still handle core demo behavior when the backend is unavailable.

Covered behaviors:
- create a dog profile and save it locally for shelter staff
- submit adopter interest using the saved general application
- update local application status
- schedule a visit and store the appointment
- return locally saved applications when backend lookup fails
- merge local dog data with mock dog data for browsing
- generate application and visit notifications from saved frontend state

How to run:
1. Open a terminal in the project root.
2. Run `npm test`

Expected result:
- Node's built-in test runner will execute `tests/frontend/pawApi.test.js`
- The terminal should show all frontend tests passing

Notes:
- These are frontend basic function tests for the client-side data layer.
- They do not require the backend server to be running.

# PawConnect

Full-stack app: React (Vite) client and Express + MongoDB API.

## Prerequisites

- Node.js 18+
- MongoDB connection string in `.env` (see below)
- `JWT_SECRET` set in `.env` (required for the API to start)

## Environment

Create a `.env` file in the project root (do not commit it):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Optional for the client when not using the Vite dev proxy:

```
VITE_API_URL=http://127.0.0.1:5000
```

## Run locally

Use two terminals from the repo root after `npm install`:

1. **API:** `npm run dev:server` — serves on `http://127.0.0.1:5000` by default.
2. **Client:** `npm run dev:client` — Vite dev server with a proxy to the API so the browser can call `/auth`, `/dogs`, and `/applications` on the same origin.

For production API only: `npm start`.

Build the client: `npm run build`, then preview static build: `npm run preview`.

## Tests

`npm test` — Jest API tests (uses `NODE_ENV=test` and in-memory/test DB per `tests/setup.js`).

## Lint

`npm run lint`

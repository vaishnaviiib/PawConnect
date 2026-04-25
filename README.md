# PawConnect

Full-stack app: React (Vite) client and Express + MongoDB API.

## Prerequisites

- Node.js 18+
- MongoDB connection string in `.env` (see below)
- `JWT_SECRET` set in `.env` (required for the API to start)

## Environment

Copy [`.env.example`](.env.example) to `.env` and fill in real values, or create `.env` manually (do not commit it):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

`PORT` is read by both **Express** (`server.js`) and **Vite’s dev proxy** ([`vite.config.js`](vite.config.js)). If you change `PORT`, keep `.env` loaded before starting the client so the proxy matches the API.

Optional for the client when not using the Vite dev proxy:

```
VITE_API_URL=http://127.0.0.1:5000
```

## Run locally

Use two terminals from the repo root after `npm install`:

1. **API:** `npm run dev:server` — listens on `PORT` from `.env` (default **5000**).
2. **Client:** `npm run dev:client` — Vite proxies `/auth`, `/dogs`, and `/applications` to `http://127.0.0.1:${PORT}` using the same `.env`.

**If the UI shows “Backend unavailable” or HTTP 502 after the survey / on Browse:** the proxy cannot reach the API. Start the API (step 1), fix `MONGO_URI` / `JWT_SECRET` if the server exits, and ensure `PORT` in `.env` matches where Express is listening. A **502** from the dev client means nothing is accepting connections at that proxy target—not an application JSON error from Express.

For production API only: `npm start`.

Build the client: `npm run build`, then preview static build: `npm run preview`.

## Tests

`npm test` — Jest API tests (uses `NODE_ENV=test` and in-memory/test DB per `tests/setup.js`).

## Lint

`npm run lint`

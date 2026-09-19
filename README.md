# jev-as-a-llm

A small chat app that tries to make Jev (TypeSafe AI's classifier) hold a conversation by picking replies one letter or word at a time. See [BLOG.md](BLOG.md) for the full write-up.

- `client/`: React + Vite chat page
- `server/`: Hono API server. The Jev logic is in `server/src/chat.ts`.

## Requirements

- Node.js 22 or newer
- A TypeSafe API key

## Setup

```sh
npm install
cp server/.env.example server/.env
```

Then open `server/.env` and set `TYPESAFE_API_KEY`.

## Run

```sh
npm run dev
```

This starts both apps:

- Server: http://localhost:3001
- Client: http://localhost:5173 (Vite forwards `/api` requests to the server)

Open the client URL and use the Letters / Small / Large tabs to switch between approaches.

## Other scripts

```sh
npm run build      # build server (server/dist) and client (client/dist)
npm run typecheck  # type-check both packages
npm start -w server  # run the built server
```

# DeskOps Helpdesk

DeskOps is a role-based IT helpdesk application built with React, Express, MongoDB, and JWT cookie authentication.

## Features

- Client registration, login, and private ticket history
- Client ticket creation with priority and status tracking
- Agent and admin ticket queues
- Admin user and role management
- Transactional ticket resolution with audit logs
- Persistent light and dark themes
- HTTP-only JWT cookies and role-based authorization

## Project Structure

- `client/` React + Vite frontend
- `server/` Express + MongoDB API

## Requirements

- Node.js 20 or newer
- A MongoDB database, local or MongoDB Atlas

## Setup

1. Create the server environment file:

   ```powershell
   Copy-Item server/.env.example server/.env
   ```

2. Create the client environment file:

   ```powershell
   Copy-Item client/.env.example client/.env
   ```

3. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `server/.env`. For local development, keep `CLIENT_URL=http://localhost:5173`.
4. Set `VITE_API_URL` in `client/.env`. For local development, use `VITE_API_URL=http://localhost:5000/api`.
5. Install dependencies:

   ```powershell
   cd server
   npm install
   cd ../client
   npm install
   ```

## Run Locally

Start the API in one terminal:

```powershell
cd server
npm start
```

Start the frontend in a second terminal:

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`.

For deployment, set these values in the hosting dashboards instead of committing environment files:

- Render: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`, and `PORT`
- Netlify: `VITE_API_URL=https://your-render-service.onrender.com/api`

## Seed Demo Accounts

Use a separate demo MongoDB database before running this command. The script is repeatable and only updates the fixed demo records; it does not delete unrelated data.

```powershell
cd server
npm run seed:demo
```

Demo credentials:

| Role   | Email                       | Password        |
| ------ | --------------------------- | --------------- |
| Client | `demo.client@deskops.local` | `DemoClient123` |
| Agent  | `demo.agent@deskops.local`  | `DemoAgent123`  |
| Admin  | `demo.admin@deskops.local`  | `DemoAdmin123`  |

Demo walkthrough:

1. Log in as the client and create a ticket.
2. Confirm the client cannot access the agent queue.
3. Log in as the agent and resolve an open ticket.
4. Log in as the admin and inspect the ticket queue and user roles.

These are fake local demo credentials. Change them before using a publicly deployed environment.

## Validation

Run the frontend checks:

```powershell
cd client
npm run lint
npm run build
```

Run the server syntax checks:

```powershell
cd server
npm test
```

Never commit `server/.env`. Use `server/.env.example` as the public configuration template.

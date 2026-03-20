# Emergency Alert System

Real-time emergency reporting and responder dispatch built as a full-stack web application with a Next.js frontend and an Express/Prisma backend.

[![CI](https://github.com/akshxdevs/emergency-alert-system/actions/workflows/ci.yml/badge.svg)](https://github.com/akshxdevs/emergency-alert-system/actions/workflows/ci.yml)

## Overview

This repository contains two apps:

- `frontend`: Next.js app for login, signup, civilian alert reporting, and responder dashboards
- `primary-backend`: Express + WebSocket backend for authentication, alert persistence, and real-time delivery

Implemented behavior in the current codebase includes:

- email/password signup and signin
- Google sign-in flow through NextAuth
- civilian alert creation from the map-based reporting UI
- role-based responder dashboards for `POLICE`, `FIRE`, and `MEDICAL`
- real-time alert delivery over WebSockets
- Postgres persistence via Prisma
- Redis-backed alert caching
- optional Kafka/Redpanda integration, with direct database fallback when Kafka credentials are not configured

## Stack

- Frontend: Next.js 14, React 18, NextAuth, Tailwind CSS, Framer Motion, Leaflet
- Backend: Node.js, Express, WebSocket (`ws`), Prisma, PostgreSQL, Redis, KafkaJS
- Validation: Node test runner, TypeScript, ESLint, GitHub Actions

## Repository Layout

```text
.
├── frontend/                # Next.js app
├── primary-backend/         # Express + WebSocket + Prisma backend
├── .github/workflows/ci.yml # CI for backend and frontend validation
└── package.json             # Root convenience scripts
```

## Prerequisites

- Node.js 20 recommended
- PostgreSQL
- Redis

Kafka credentials are optional. If they are not set, the backend continues without Kafka and stores alerts directly in Postgres.

## Configuration

Create local env files from the provided examples:

```bash
cp primary-backend/.env.example primary-backend/.env
cp frontend/.env.example frontend/.env
```

### Backend env

Defined in [primary-backend/.env.example](primary-backend/.env.example):

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/emergency_alert_system
JWT_SECRET=change-me
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=
KAFKA_SASL_MECHANISM=scram-sha-256
KAFKA_USERNAME=
KAFKA_PASSWORD=
```

### Frontend env

Defined in [frontend/.env.example](frontend/.env.example):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me
GOOGLE_CLIENT_ID=change-me
GOOGLE_CLIENT_SECRET=change-me
```

## Setup

Install dependencies for each app:

```bash
cd primary-backend && npm ci
cd ../frontend && npm ci
```

## Development

Run the backend:

```bash
cd primary-backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

The backend listens on `PORT` from `primary-backend/.env`. The frontend reads its API and WebSocket targets from `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_WS_URL`.

## Validation

Root convenience scripts:

```bash
npm run build
npm run test
npm run validate
```

App-level scripts:

```bash
cd primary-backend && npm run typecheck && npm test
cd frontend && npm run validate
```

Current CI runs:

- backend `npm ci`, `npm run typecheck`, `npm test`
- frontend `npm ci`, `npm run validate`

## API and Realtime Contracts

### REST endpoints

Backend user routes are mounted at `/api/v1/user`.

Implemented routes include:

- `GET /check-email`
- `GET /by-email`
- `POST /signup`
- `POST /signin`
- `POST /google-signup`

### WebSocket connection

Clients connect to:

```text
{WS_URL}/{userId}/?{ROLE}
```

Example:

```text
ws://localhost:5000/user123/?POLICE
```

### New alert message

Clients send new alerts over the WebSocket connection using the `NEW_ALERT` event shape used by the current backend:

```json
{
  "type": "NEW_ALERT",
  "payload": {
    "id": "alert-001",
    "type": "CRIME",
    "reportedBy": "user123",
    "assignedTo": "POLICE",
    "status": "REPORTED",
    "priority": "HIGH",
    "description": "Suspicious activity spotted",
    "timeStamp": "2026-01-01T12:00:00.000Z",
    "location": {
      "lat": 28.6139,
      "long": 77.2090
    }
  }
}
```

The backend also handles alert status updates and cancellations, then broadcasts updates to connected clients.

## Architecture Notes

- The frontend handles authentication and routing for civilian and responder views.
- The backend exposes user auth endpoints and runs the WebSocket server on the same HTTP server.
- Prisma models live in `primary-backend/prisma/schema.prisma`.
- Redis stores alert snapshots keyed by alert ID.
- Kafka producer and consumer initialization is conditional on credentials being present.
- Responder dashboards load pending alerts for their assigned role when they connect.

## Known Scope

This repository currently reflects a web-based system. Mobile clients, SMS, and email delivery are not implemented in the codebase.

# Bus Logistics Platform

Android-first goods logistics platform for bus-based parcel movement. This repository is structured as a production-oriented monorepo with:

- `apps/mobile`: Expo React Native app for customers, operators, and drivers
- `apps/api`: TypeScript API for shipment operations and tracking
- `packages/shared`: Shared business types and contracts

## Product scope

This app is for sending goods through bus routes and tracking parcel movement. It is not a passenger seat booking app.

Core flows:

- Customers track a shipment with a tracking ID
- Operators create shipments and assign them to buses/routes
- Drivers update checkpoints and delivery progress

## Stack

- Mobile: Expo + React Native + Expo Router + TypeScript
- Backend: Node.js + Express + TypeScript + Zod
- Shared package: TypeScript contracts

## Monorepo structure

```text
apps/
  api/
  mobile/
packages/
  shared/
```

## Project structure

```text
bus-logistics/
  apps/
    api/
      src/
        app.ts
        server.ts
        data/
          store.ts
        routes/
          health.ts
          routes.ts
          shipments.ts
    mobile/
      app/
        _layout.tsx
        index.tsx
        operator.tsx
        driver.tsx
        tracking/
          [trackingId].tsx
      lib/
        api.ts
      .env.example
      app.json
  packages/
    shared/
      src/
        index.ts
  docs/
    architecture.md
  package.json
  tsconfig.base.json
  README.md
```

### Folder purpose

- `apps/api`: backend service for shipment tracking, bus data, and logistics operations
- `apps/mobile`: Android-first Expo app for customer, operator, and driver flows
- `packages/shared`: shared TypeScript types used by both mobile and backend
- `docs`: architecture and product expansion notes

### Important backend files

- `apps/api/src/server.ts`: starts the Express server
- `apps/api/src/app.ts`: configures middleware and API routes
- `apps/api/src/data/store.ts`: current seeded in-memory data for shipments, buses, routes, and events
- `apps/api/src/routes/shipments.ts`: shipment APIs for list, tracking lookup, create, and status update
- `apps/api/src/routes/routes.ts`: transport APIs for route and bus data
- `apps/api/src/routes/health.ts`: health check endpoint

### Important mobile files

- `apps/mobile/app/_layout.tsx`: root navigation and screen layout
- `apps/mobile/app/index.tsx`: home screen that links to customer, operator, and driver flows
- `apps/mobile/app/operator.tsx`: operator dashboard screen
- `apps/mobile/app/driver.tsx`: driver console screen
- `apps/mobile/app/tracking/[trackingId].tsx`: customer shipment tracking screen
- `apps/mobile/lib/api.ts`: API client for calling the backend from the mobile app
- `apps/mobile/.env.example`: sample environment file for emulator API configuration

### Shared package

- `packages/shared/src/index.ts`: domain types such as `Shipment`, `Route`, `Bus`, and tracking event contracts

### Root files

- `package.json`: workspace setup and top-level scripts
- `tsconfig.base.json`: shared TypeScript configuration for all workspaces
- `README.md`: setup guide and repository overview

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the API:

```bash
npm run dev:api
```

3. Start the mobile app:

```bash
npm run dev:mobile
```

4. Run on the Android emulator:

```bash
Press a in the Expo terminal
```

## Environment

The API listens on port `4000` by default.

For the mobile app, set:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:4000
```

Use your machine's local network IP when testing on a physical Android device.

For the Android emulator, use:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000
```

`10.0.2.2` maps the emulator back to your computer's localhost.

You can copy [apps/mobile/.env.example](c:/Users/subha/OneDrive/Desktop/Bus logistics/apps/mobile/.env.example) to `apps/mobile/.env` and keep that emulator value there.

## Current implementation

- Seeded backend with routes, buses, shipments, and shipment timeline events
- Customer shipment tracking screen
- Operator dashboard screen
- Driver route progress screen
- Shared business contracts across mobile and API

## Architecture notes

See [docs/architecture.md](docs/architecture.md) for the production-oriented module layout and next expansion path.

## Next production steps

- Replace in-memory storage with PostgreSQL + Prisma
- Add authentication and role-based authorization
- Add bus GPS ingestion and geofenced stop updates
- Add notifications over SMS/WhatsApp/email
- Add admin analytics and exception management

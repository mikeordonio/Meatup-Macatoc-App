# Phase 10 Testing, Docker, and Deployment Preparation

## Implemented

- Added focused CartService tests for:
  - 0.25 kg quantity increments.
  - Stock limits.
  - Shop totals.
- Added Firebase Emulator Suite port configuration for Authentication,
  Firestore, Realtime Database, and Emulator UI.
- Added a production Nginx Docker image with Angular route fallback.
- Added Docker Compose configuration exposing the app on port 8080.
- Added `.dockerignore` to keep source dependencies and build output outside
  the image build context where appropriate.
- Added README instructions for local development, validation, Firebase
  deployment, emulator startup, and Docker serving.

## Validation commands

```text
npm run build
npm run lint
npx ng test --watch=false
```

## Deployment commands

```text
firebase deploy --only firestore,database --project meatup-d0cc1
npm run build
docker compose build
docker compose up
```

No Firebase service-account credentials are included in the frontend or
container configuration.

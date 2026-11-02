# MeatUp Macatoc

MeatUp Macatoc is an Ionic Angular marketplace for pork and chicken shops,
customers, shop owners, and administrators.

## Requirements

- Node.js and npm
- Firebase project configuration in
  `src/environments/environment.ts` and `environment.prod.ts`
- Firebase CLI for deploying rules and indexes
- Docker only when using the container workflow

## Local development

```text
npm install
npm start
```

The development server is available at `http://localhost:4200`.

## Validation

```text
npm run build
npm run lint
npx ng test --watch=false
```

The tests include cart quantity, stock, and total validation. Live Firebase
flows require configured Authentication, Firestore, and Realtime Database
services.

## Firebase deployment

Deploy Firestore rules and indexes plus Realtime Database rules:

```text
firebase deploy --only firestore,database --project meatup-d0cc1
```

Do not place Firebase service-account private keys in the frontend, Docker
image, or source control. The Firebase web configuration is public client
configuration; access control is enforced by Authentication and security
rules.

## Firebase Emulator Suite

Start the configured Auth, Firestore, Realtime Database, and Emulator UI
services after installing the Firebase CLI:

```text
firebase emulators:start --project meatup-d0cc1
```

The Emulator UI is available at `http://localhost:4000`. The application
currently points to the configured Firebase project by default; connecting the
frontend to emulators requires a deliberate environment switch before local
emulator testing.

## Docker

Build the production bundle first, then build and run the static web container:

```text
npm run build
docker compose build
docker compose up
```

The application is available at `http://localhost:8080`. Nginx falls back to
`index.html` so Angular routes work on direct navigation.

## Current known warnings

- Angular reports legacy browser targets from the existing Browserslist
  configuration.
- Ionic reports that `IonicModule` is deprecated in favor of
  `provideIonicAngular()`. The project remains NgModules-based by design.

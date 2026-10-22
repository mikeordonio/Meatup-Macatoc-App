# Phase 1 Foundation

## Current application structure

- `src/app/app-routing.module.ts` contains the root route and lazy-loads the tabs shell.
- `src/app/tabs/` contains the Ionic tabs shell and child route configuration.
- `src/app/tab1/`, `src/app/tab2/`, and `src/app/tab3/` are the starter tab pages.
- `src/app/core/` is reserved for application-wide guards, models, and services.
- `src/app/features/` is reserved for role and domain feature areas.
- `src/app/shared/components/` is reserved for reusable UI components.
- `src/environments/` contains build-time environment configuration.

The existing tabs navigation is intentionally unchanged during Phase 1. It remains
the working application shell until authentication and role-based navigation are
implemented in later phases.

## Firebase configuration status

- The development Firebase web configuration is present in
  `src/environments/environment.ts`.
- `src/environments/environment.prod.ts` currently contains only `production:
  true`; it does not contain a Firebase configuration.
- Firebase packages are already listed in `package.json`.
- Firebase initialization and authentication are implemented in Phase 2.
- Firebase Storage is intentionally not used by this project.
- Firestore authorization rules are defined in `firestore.rules`; deploy them
  with the Firebase CLI for backend enforcement.

The Phase 2 authentication implementation uses the same web configuration in
both build environments. No service-account private key belongs in this
frontend project. See `PHASE-2-AUTHENTICATION.md` for the authentication and
Firestore deployment details.

## Baseline verification

The starter application currently passes:

```text
npm run build
npm run lint
```

The build reports a non-blocking Browserslist warning because several older
browser targets are outside Angular 22's supported browser range. This does not
prevent the current build from completing.

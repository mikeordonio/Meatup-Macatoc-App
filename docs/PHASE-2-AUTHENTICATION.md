# Phase 2 Authentication

## Implemented

- Firebase App, Authentication, and Firestore are initialized once in
  `src/app/core/services/firebase.ts`.
- Customer registration creates an email/password Firebase Auth account and a
  Firestore profile with the fixed `customer` role and `active` status.
- Login loads and validates the user's Firestore profile.
- Logout signs the user out and clears the in-memory profile.
- Password reset sends a Firebase reset email.
- Firebase auth-state changes update the application profile state.
- Unauthenticated users are redirected to `/auth/login`.
- Authenticated users are redirected away from the auth pages.
- A reusable role guard is available for role-specific routes.
- The tabs shell includes a sign-out action.
- `firestore.rules` prevents public self-assignment of `admin` or `shopOwner`.

## Routes

| Route | Access |
| --- | --- |
| `/auth/login` | Guests |
| `/auth/register` | Guests |
| `/auth/reset-password` | Guests |
| `/tabs/*` | Authenticated users |

Shop-owner applications and administrator assignment are intentionally
deferred to later phases. Role-specific navigation is implemented in
`PHASE-3-ROLE-NAVIGATION.md`.

## Firebase deployment

Deploy the Firestore rules with the Firebase CLI from the project root:

```text
firebase deploy --only firestore:rules --project meatup-d0cc1
```

The Firebase web configuration is safe to include in a frontend build. Never
put a Firebase Admin SDK service-account private key in this project.

Firebase Authentication must also have the Email/Password provider enabled in
the Firebase Console. The application cannot complete registration or login
until that provider is enabled.

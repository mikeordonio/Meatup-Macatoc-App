# Phase 9 Notifications and Final Integration

## Implemented

- Added Firestore-backed, recipient-scoped in-app notifications.
- Added a Notifications tab for customers, shop owners, and administrators.
- Added real-time notification updates and unread counts.
- Added read-state updates for individual notifications.
- Added notifications for:
  - New orders received by shop owners.
  - Order status changes and cancellations.
  - Order-specific messages.
  - Products reaching zero stock after checkout.
  - Shop approval, rejection, or suspension.
- Added Firestore rules restricting notifications to their intended recipient.
- Added the Firestore composite index required to list a recipient's
  notifications newest-first.
- Kept push notifications out of this phase because no push infrastructure is
  configured.

Deploy the updated rules with:

```text
firebase deploy --only firestore --project meatup-d0cc1
```

The existing order, messaging, shop, admin, and role-based navigation flows
remain integrated with the new notification collection.

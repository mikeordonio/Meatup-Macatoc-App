# Phase 8 Administration

## Implemented

- Administrator dashboard statistics for users, shops, orders, and revenue.
- User monitoring for customer and shop-owner accounts.
- Administrator account suspension and reactivation, while protecting the
  administrator from suspending their own account.
- Platform-wide order activity logs with search by order ID, customer, or shop.
- Order-log filtering by status.
- Order status history stored on orders for legacy and current records.
- New owner status changes create immutable `orderLogs` records containing the
  order, previous and new status, timestamp, and actor.
- Firestore rules restrict administrator data access and prevent log updates or
  deletion.

## Routes

| Route | Role | Purpose |
| --- | --- | --- |
| `/tabs/admin-dashboard` | `admin` | View platform statistics |
| `/tabs/users` | `admin` | Monitor and manage account status |
| `/tabs/admin-shops` | `admin` | Review shop applications |
| `/tabs/order-logs` | `admin` | Search and review order activity |

Deploy the updated rules with:

```text
firebase deploy --only firestore --project meatup-d0cc1
```

The current frontend creates immutable order logs during shop-owner status
updates. For higher-assurance security-sensitive auditing, this can later move
to a trusted backend or Cloud Function.

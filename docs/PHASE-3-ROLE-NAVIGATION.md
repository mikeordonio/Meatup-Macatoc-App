# Phase 3 Role-Based Tabs and Dashboards

## Role navigation

The shared tabs shell reads the authenticated Firestore profile and renders
only the navigation for that role:

| Role | Tabs |
| --- | --- |
| `customer` | Home, Shops, Orders, Profile |
| `shopOwner` | Dashboard, Products, Orders, Profile |
| `admin` | Dashboard, Users, Shops, Order Logs, Profile |

The current feature pages provide the role-specific navigation surface and
clear placeholders for the business workflows implemented in later phases.

## Route protection

Every role-specific child route includes `roleGuard` route data. The guard
checks the role from the authenticated Firestore profile and redirects an
unauthorized user to that role's default page. Hidden tab buttons are not the
security boundary.

Backend access remains governed by Firestore Security Rules. New collections
and role-specific data rules must be added before their corresponding feature
phases are deployed.

## Deferred work

- Customer product catalog: Phase 5.
- Shop registration and approval: Phase 4 is now implemented.
- Shop-owner product management: Phase 5.
- Order workflows: Phase 6.
- Admin user/shop/order data screens: Phase 8.

# Phase 4 Shop Registration and Approval

## Implemented

- Shop owners can submit shop name, owner identity, address, service area,
  contact number, description, and an optional image URL.
- Shop owners can view their submitted shops and edit shop details.
- New shops start with `pending` status.
- Administrators can view all shop applications.
- Administrators can approve, reject, or suspend shops.
- Customers can view only shops with `approved` status.
- Shop status values are `pending`, `approved`, `rejected`, and `suspended`.
- Firestore rules enforce owner/admin/customer access independently of the UI.
- Each shop owner can register one shop. Registration and editing are available
  from the shop owner's Profile tab; the Dashboard is reserved for shop
  activity.
- The one-shop constraint is enforced by the application service and UI.
  Firestore rules were intentionally not changed for this constraint.

## Route surfaces

| Route | Role | Purpose |
| --- | --- | --- |
| `/tabs/dashboard` | `shopOwner` | Review shop activity and daily operations |
| `/tabs/profile` | `shopOwner` | Register or edit the owner's single shop |
| `/tabs/admin-shops` | `admin` | Review and update shop statuses |
| `/tabs/shops` | `customer` | Browse approved shops |

The existing role guard protects these routes, while `firestore.rules` protects
the underlying data:

- Shop owners can create and edit only their own shops.
- Shop owners cannot change owner identity or approval status.
- Administrators can read all shops and change statuses.
- Customers can read only approved shops.

## Image handling

Shop image management currently accepts an optional image URL. Product image
upload is implemented in Phase 5; broader shop-media management can be added
later without placing service-account credentials in the frontend.

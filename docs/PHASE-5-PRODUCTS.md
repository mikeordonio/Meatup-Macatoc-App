# Phase 5 Product Catalog and Inventory

## Implemented

- Shop owners can add and edit pork and chicken products.
- Products include name, category, description, price per kilogram,
  available quantity, image, and availability status.
- Price validation requires a value greater than zero.
- Inventory validation requires zero or a multiple of `0.25` kg.
- Low-stock indicators appear when stock is at or below `1.00` kg.
- Products can be marked available or unavailable.
- Shop owners can upload product images converted to Base64 data URLs and
  stored directly in Firestore. The client limits source files to 700 KB to
  keep product documents within Firestore document limits.
- Customers can browse approved-shop products.
- Customers can search by product, shop, or description.
- Customers can filter products by pork or chicken.
- Products from unapproved shops and products with no available stock are
  excluded from the customer catalog.

## Route surfaces

| Route | Role | Purpose |
| --- | --- | --- |
| `/tabs/products` | `shopOwner` | Manage products and inventory |
| `/tabs/shops` | `customer` | Browse, search, and filter products |

Products can only be created for an approved shop owned by the authenticated
shop owner. Firestore rules enforce this independently of the UI.

## Firebase deployment

Deploy Firestore and Realtime Database rules:

```text
firebase deploy --only firestore:rules,database --project meatup-d0cc1
```

The first combined product query may require the Firebase project to create
an index if the deployed Firestore configuration requests one. The current
query constrains products by approved shop IDs and filters availability in
the application to avoid an unnecessary composite index.

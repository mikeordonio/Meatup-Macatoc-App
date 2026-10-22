# Phase 6 Cart, Checkout, and Orders

## Implemented

- Customers can add products to a cart and adjust quantities in `0.25 kg`
  increments.
- The cart is grouped into one order per shop during checkout.
- Customers select pickup or delivery and provide the required details.
- Checkout validates current stock and price inside a Firestore transaction.
- Inventory is decremented atomically to prevent overselling and duplicate
  stock processing.
- Customers can view order history and cancel pending orders.
- Shop owners can view incoming orders for their shops.
- Shop owners can accept, reject, process, mark ready/for delivery, and
  complete orders.
- Supported lifecycle:
  `Pending -> Accepted -> Processing -> Ready/For Delivery -> Completed`.

## Routes

| Route | Roles | Purpose |
| --- | --- | --- |
| `/tabs/orders` | `customer`, `shopOwner` | Customer cart/history or owner order management |

Firestore rules restrict order reads to the customer, responsible shop owner,
or administrator. Customers can only cancel pending orders, and shop owners
cannot change customer or shop ownership fields.

## Firestore indexes

The customer and owner order history queries order by `createdAt` while
filtering by the relevant user ID. If Firebase requests a composite index,
create it using the link provided by the Firebase error message.

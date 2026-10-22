# Phase 7 Order Communication

## Implemented

- Customers can open a conversation from an order card.
- Shop owners can open the corresponding conversation from incoming orders.
- Conversations are stored in Realtime Database under:

```text
conversations/{orderId}/
  customerId
  shopOwnerId
  messages/{messageId}/
    senderId
    senderName
    content
    createdAt
  readAt/{userId}
```

- Messages update in real time with Realtime Database listeners.
- Messages display sender, content, and timestamp.
- Both participants can send messages.
- Messages are limited to 1,000 characters.
- Opening a conversation records the participant's read timestamp.
- Order cards show unread-message counts.
- Participants are authorized using both the application service and
  `database.rules.json`.

## Access control

Only the customer and shop owner stored on the corresponding Firestore order
can read or write that order's Realtime Database conversation. Other
authenticated users cannot access it. Conversation metadata is created from
the trusted order participant fields when the first message is sent.

Deploy the Realtime Database rules with:

```text
firebase deploy --only database --project meatup-d0cc1
```

The current implementation uses Realtime Database for messages and
Firestore for the authoritative order record.

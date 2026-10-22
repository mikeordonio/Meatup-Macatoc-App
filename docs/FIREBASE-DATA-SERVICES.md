# Firebase Data Services

The project uses only:

- Firebase Authentication for accounts and sessions.
- Cloud Firestore for user profiles, shops, products, and Base64 product
  images.
- Realtime Database for future order conversations and real-time messages.

Firebase Storage is not used. Product image files are converted to Base64 data
URLs in the browser before they are written to the product document. The
client rejects files larger than 700 KB because Base64 increases the stored
size and Firestore documents have a size limit.

The Realtime Database URL is configured in both environment files. Verify that
the database exists at that URL in the Firebase Console before deployment.

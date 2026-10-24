# API Documentation

### `GET /api/documents`
- **Auth**: Required
- **Returns**: Array of metadata for documents caller is authorized to view.

### `GET /api/documents/:id`
- **Auth**: Required
- **Returns**: Document content if user ID is present in document grants.
- **Errors**: `403 Forbidden` if user is unauthorized (logged to audit ledger).

### `POST /api/documents/:id/share`
- **Auth**: Owner Only
- **Body**: `{ "targetUser": "bob" }`
- **Returns**: `200 OK`
# Users API

## Base Route

/api/users

## Endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | /api/users | Protected | Get users |
| GET | /api/users/:userId | Protected | Get a specific user |
| PUT | /api/users/:userId | Protected | Update user information |
| DELETE | /api/users/:userId | Protected | Delete a user |

---

# Authentication

User endpoints are protected unless the specific route implementation explicitly defines otherwise.

Authenticated requests must provide valid authentication credentials.

Authentication middleware:

```text
backend/src/core/security/auth.middleware.js

1. Keep user functionality inside the user module.

2. Keep profile-specific functionality inside the profile module.

3. Require authentication for protected user operations.

4. Validate user identifiers before database queries when required.

5. Return 404 when a requested user does not exist.

6. Return 401 when authentication is missing or invalid.

7. Return 403 when the authenticated user is not authorized.

8. Return 409 for user-data conflicts.

9. Never expose passwords or password hashes.

10. Never expose authentication secrets.

11. Reuse the centralized error-handling system.

12. Reuse existing authentication and authorization middleware.

13. Keep API responses consistent.

14. Do not duplicate user-management logic in unrelated modules.

15. Update API documentation whenever the user API contract changes.

16. Keep Swagger documentation synchronized with the implementation.

[ ] Route is registered correctly.

[ ] HTTP method matches the API contract.

[ ] Authentication requirement is correct.

[ ] Authorization requirement is correct.

[ ] User ID validation is handled.

[ ] User-not-found behavior is handled.

[ ] Duplicate data behavior is handled.

[ ] Sensitive fields are excluded from responses.

[ ] Error responses use the centralized error system.

[ ] Existing middleware is reused.

[ ] Swagger documentation is updated.

[ ] This documentation is updated when the API changes.
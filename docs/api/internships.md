# Internships API

## Base Route

/api/internships

## Endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | /api/internships | Public | Get available internships |
| GET | /api/internships/:internshipId | Public | Get a specific internship |

---

# 1. Get All Internships

## Endpoint

GET `/api/internships`

## Authentication

Not required.

## Request Body

No request body required.

## Query Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| page | number | No | Page number |
| limit | number | No | Number of internships per page |
| search | string | No | Search internships |
| category | string | No | Filter internships by category |
| location | string | No | Filter internships by location |
| mode | string | No | Filter by internship mode |
| status | string | No | Filter by internship status |

## Example Request

```http
GET /api/internships

1. Internship functionality must remain inside the internships module.

2. Internship-specific business logic must not be placed inside unrelated modules.

3. Internship responses should remain consistent across endpoints.

4. Do not expose unnecessary internal database fields.

5. Validate internship identifiers before database queries when required.

6. Return 404 when the requested internship does not exist.

7. Use the existing centralized error-handling system.

8. Reuse existing validation and security middleware where applicable.

9. Keep filtering and pagination behavior consistent with the actual implementation.

10. Update this documentation whenever the internship API contract changes.

11. Keep Swagger documentation synchronized with the implementation.

12. Do not introduce a duplicate internship API implementation in another module.


[ ] Route exists and is correctly registered.

[ ] HTTP method matches the API contract.

[ ] Request parameters are validated.

[ ] Authentication requirement is correct.

[ ] Authorization requirement is correct when applicable.

[ ] Internship-not-found behavior is handled.

[ ] Invalid identifiers are handled.

[ ] API response structure remains consistent.

[ ] Sensitive internal fields are not exposed.

[ ] Related Swagger documentation is updated.

[ ] This documentation is updated when the API changes.
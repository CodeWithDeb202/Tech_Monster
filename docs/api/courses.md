# Courses API

## Base Route

/api/courses

## Endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | /api/courses | Public | Get all available courses |
| GET | /api/courses/:courseId | Public | Get a specific course |

---

# 1. Get All Courses

## Endpoint

GET `/api/courses`

## Authentication

Not required.

## Request Body

No request body required.

## Query Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| page | number | No | Page number |
| limit | number | No | Number of courses per page |
| search | string | No | Search courses by relevant text |
| category | string | No | Filter courses by category |

## Example Request

```http
GET /api/courses

1. Course endpoints must remain inside the courses module.
2. Course-specific business logic must not be placed inside unrelated modules.
3. Course responses should remain consistent.
4. Do not expose internal database fields unnecessarily.
5. Validate course identifiers before querying when validation is required.
6. Return 404 when a requested course does not exist.
7. Update this documentation whenever the course API contract changes.
8. Keep Swagger documentation synchronized with the implementation.
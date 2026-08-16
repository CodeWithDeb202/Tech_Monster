# API Error Handling

## Purpose

This document defines the standard error-handling conventions used by the Tech Monster backend API.

All API errors should follow the application's centralized error-handling architecture instead of implementing separate error-response systems inside individual modules.

---

# Standard Error Response

The standard error response uses the following structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descriptive error message"
}


1. Use the existing AppError class for expected application errors.

2. Use the centralized error handler for HTTP error responses.

3. Use asyncHandler for asynchronous controllers where the module architecture supports it.

4. Do not duplicate global error-handling logic.

5. Do not expose sensitive internal information.

6. Use the correct HTTP status code.

7. Return clear and actionable error messages.

8. Do not expose database stack traces to clients.

9. Do not expose environment variables.

10. Do not expose authentication secrets.

11. Keep error-response structures consistent.

12. Validate user input before processing it.

13. Return 404 when an expected resource does not exist.

14. Return 409 for resource conflicts.

15. Return 401 for authentication failures.

16. Return 403 for authorization failures.

17. Return 429 when a rate limit is exceeded.

18. Return 500 only for unexpected server-side failures.

19. Return 503 when the service is unavailable.

20. Update API documentation when error behavior changes.


[ ] Correct HTTP status code is used.

[ ] Expected errors use AppError.

[ ] Async errors are handled correctly.

[ ] Validation errors are handled.

[ ] Authentication errors are handled.

[ ] Authorization errors are handled.

[ ] Resource-not-found errors are handled.

[ ] Duplicate-resource errors are handled.

[ ] Rate-limit behavior is preserved.

[ ] Sensitive information is not exposed.

[ ] Production responses do not expose stack traces.

[ ] Error response structure remains consistent.

[ ] Related API documentation is updated.
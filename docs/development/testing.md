# Testing

This document defines the testing standards and verification process for the Tech Monster project.

## Testing Goals

Testing should help ensure that:

- New features work as expected.
- Existing functionality is not unintentionally broken.
- API responses are correct.
- Authentication and authorization behave correctly.
- Validation and error handling work correctly.
- Database operations behave correctly.
- Frontend components and user interactions work correctly.
- Production builds complete successfully.
- Code follows the project's quality standards.

## Testing Stack

### Backend

The backend includes:

- Jest
- Supertest

Backend test dependencies are defined in `backend/package.json`.

### Frontend

The frontend currently provides:

- ESLint
- Vite production build verification

The frontend does not currently define a dedicated automated test runner in `frontend/package.json`.

## Backend Test Command

Run backend tests from the `backend` directory:

    npm test

The current backend test script is a placeholder and does not yet execute an automated test suite.

## Frontend Quality Checks

Run ESLint from the `frontend` directory:

    npm run lint

Create a production build:

    npm run build

Preview the production build:

    npm run preview

## Test File Naming

Use descriptive test filenames that match the source file or feature being tested.

Examples:

    auth.test.js
    user.test.js
    course.test.js
    auth.integration.test.js
    CourseCard.test.jsx
    Navbar.test.jsx

Keep tests close to the code they test when the project's directory structure supports colocated tests.

## Backend Unit Testing

Backend unit tests should focus on isolated application logic.

Test areas may include:

- Utility functions
- Validation logic
- Authentication helpers
- Authorization logic
- Service functions
- Data transformation
- Error handling

Recommended structure:

    backend/
    └── src/
        ├── controllers/
        ├── services/
        ├── models/
        ├── middleware/
        └── tests/
            ├── auth.test.js
            ├── user.test.js
            └── course.test.js

## Backend API Testing

Use Supertest for HTTP/API integration testing.

Important API scenarios should cover:

- Successful requests
- Invalid requests
- Missing required fields
- Authentication failures
- Authorization failures
- Resource not found responses
- Validation errors
- Server errors
- Database-related failures

Test both successful and unsuccessful responses.

Example:

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

Validation error example:

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

## Authentication Testing

Authentication-related tests should verify:

- User registration
- User login
- Invalid credentials
- Missing credentials
- Invalid tokens
- Expired tokens
- Protected routes
- Logout behavior
- Refresh-token behavior

Never use real user credentials or production secrets in tests.

## Authorization Testing

Authorization tests should verify that users can access only resources permitted by their role or ownership.

Test scenarios should include:

- Authorized user
- Unauthorized user
- Missing authentication
- Invalid authentication
- Restricted administrative endpoints
- Resource ownership checks

## Validation Testing

Validation should be tested with:

- Valid input
- Missing fields
- Empty values
- Invalid data types
- Invalid formats
- Boundary values
- Unexpected values

Important validation areas include:

    email
    password
    username
    IDs
    query parameters
    request body
    file uploads

## Error Handling Testing

Verify that errors return consistent HTTP status codes and response structures.

Test common cases such as:

    400 Bad Request
    401 Unauthorized
    403 Forbidden
    404 Not Found
    409 Conflict
    429 Too Many Requests
    500 Internal Server Error
    503 Service Unavailable

Do not expose sensitive internal information in API error responses.

## Database Testing

Database-related tests should verify:

- Document creation
- Document retrieval
- Document updates
- Document deletion
- Invalid IDs
- Duplicate records
- Missing records
- Validation failures
- Relationship and reference handling

Tests should use isolated test data and must not modify production databases.

## File Upload Testing

For features using file uploads, test:

- Valid files
- Missing files
- Unsupported file types
- File size limits
- Upload failures
- Successful uploads
- External storage failures

Do not use production Cloudinary or other production storage credentials in automated tests.

## Email Testing

Email-related features should be tested without sending unintended real emails.

Verify:

- Recipient validation
- Required email fields
- Email template generation
- Service failure handling
- Invalid configuration handling

Use mocks or test providers where appropriate.

## Socket.IO Testing

Real-time functionality should verify:

- Client connection
- Server connection
- Authentication where required
- Event emission
- Event reception
- Invalid events
- Disconnect handling
- Reconnection behavior

## Scheduled Job Testing

Scheduled jobs should be tested independently from the scheduler when possible.

Verify:

- Correct job execution
- Expired records
- Cleanup operations
- Failure handling
- Repeated execution behavior

Tests should not require waiting for real scheduled intervals.

## Frontend Component Testing

When a frontend test framework is introduced, components should be tested for:

- Rendering
- Props
- User interactions
- Form submission
- Loading states
- Error states
- Empty states
- Conditional rendering
- Navigation
- Accessibility

Recommended naming:

    ComponentName.test.jsx

## Frontend Form Testing

Forms should be tested for:

- Required fields
- Invalid values
- Valid values
- Validation messages
- Submit behavior
- Loading state
- Successful submission
- Failed submission
- Reset behavior

## Frontend API Testing

API-dependent components should verify:

- Successful API responses
- Loading state
- Empty responses
- Validation errors
- Authentication errors
- Server errors
- Network failures

Mock external API requests in component tests instead of depending on a live backend.

## Frontend Routing Testing

Verify:

- Public routes
- Protected routes
- Unauthorized access
- Redirect behavior
- Invalid routes
- Route parameters
- Navigation behavior

## Loading and Error States

Every asynchronous feature should be checked for:

    Loading
    Success
    Empty
    Error

Avoid leaving users with blank screens when an asynchronous operation fails.

## Production Build Testing

Before creating a Pull Request, verify that the frontend builds successfully:

    cd frontend
    npm run build

A failed production build should be fixed before merging the related changes.

## Lint Testing

Run:

    cd frontend
    npm run lint

Fix lint errors before submitting frontend changes.

Warnings should also be reviewed when they indicate potential bugs or maintainability issues.

## Manual Testing

Automated tests should be complemented with manual verification for user-facing changes.

Manual testing should cover:

- Desktop layout
- Responsive layout
- Navigation
- Forms
- Buttons
- Loading states
- Error states
- Authentication
- API interaction
- File uploads
- Real-time features when applicable

## Regression Testing

When fixing a bug:

1. Reproduce the original problem.
2. Add an automated test when practical.
3. Apply the fix.
4. Run the related test.
5. Run the broader test suite.
6. Verify the original scenario manually when necessary.

## Pre-Commit Verification

Before committing changes:

    git status
    git diff

Frontend changes:

    cd frontend
    npm run lint
    npm run build

Backend changes:

    cd backend
    npm test

## Pull Request Verification

Before opening a Pull Request:

- Run relevant automated tests.
- Run frontend linting.
- Verify the frontend production build.
- Verify affected API endpoints.
- Check authentication and authorization when applicable.
- Test affected user flows.
- Review the complete Git diff.
- Remove debug logs.
- Remove temporary code.
- Ensure no secrets are included.

## Test Data

Use dedicated test data.

Do not use:

- Production users
- Production credentials
- Production database records
- Real API keys
- Real JWT secrets
- Real email credentials
- Production Cloudinary credentials

Use environment-specific test configuration instead.

## Environment Isolation

Tests must not depend on production configuration.

Keep test credentials and test database configuration separate from development and production environments.

Never commit sensitive test credentials to the repository.

## Test Independence

Each test should be independent whenever possible.

Avoid tests that depend on:

- Execution order
- Another test's database state
- A previous test's authentication state
- External production services
- Manual setup from another developer

Clean up temporary test data after tests complete.

## Test Quality Rules

Tests should be:

- Deterministic
- Isolated
- Readable
- Fast
- Focused
- Repeatable

Avoid tests that rely on arbitrary delays or external services unless the purpose of the test requires integration testing.

## Recommended Testing Order

Use the following order when validating a change:

    1. Run the relevant unit tests
    2. Run the relevant integration/API tests
    3. Run frontend linting
    4. Run the frontend production build
    5. Perform manual verification
    6. Review the Git diff
    7. Commit the changes

## Current Testing Status

The project currently has testing dependencies available for the backend, including Jest and Supertest.

The backend `npm test` command is currently a placeholder and does not yet execute an automated test suite.

The frontend currently provides ESLint and Vite build verification but does not define a dedicated automated component or integration test command.

As the project grows, automated unit, integration, API, and frontend tests should be added to the relevant areas of the application.
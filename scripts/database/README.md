# Database Scripts

This directory is reserved for database-related scripts used for development, maintenance, migration, seeding, backup, and database administration tasks.

## Purpose

Database scripts should contain repeatable operations that help developers and maintainers work with the Tech Monster database safely and consistently.

Typical operations may include:

- Database seeding
- Development data creation
- Data migration
- Data cleanup
- Database backup
- Database restore
- Data export
- Data import
- Database maintenance

## Directory Structure

Recommended structure:

    scripts/
    └── database/
        ├── README.md
        ├── seed.js
        ├── migrate.js
        ├── backup.js
        ├── restore.js
        └── migrations/

Add a script only when the corresponding database operation is actually required by the project.

## Script Rules

Database scripts must:

- Be safe to run.
- Be clearly named.
- Use environment variables for configuration.
- Never contain hard-coded credentials.
- Never contain production secrets.
- Validate required environment variables.
- Handle database connection failures.
- Close database connections correctly.
- Provide useful success and error output.
- Avoid destructive operations by default.
- Require explicit confirmation before destructive production operations.

## Environment Configuration

Database scripts should use the project's environment configuration.

Example:

    MONGODB_URI=mongodb://127.0.0.1:27017/tech-monster

Never commit:

- Database usernames
- Database passwords
- MongoDB Atlas credentials
- Connection strings containing credentials
- Production secrets

## Development Database

Development scripts should use a development database and must not accidentally connect to production.

Before running a destructive operation, verify the configured database connection.

Example:

    node scripts/database/seed.js

## Seed Scripts

Seed scripts should create predictable development or test data.

A seed script should:

1. Load environment variables.
2. Validate the database connection configuration.
3. Connect to MongoDB.
4. Create or update the required data.
5. Report the result.
6. Close the database connection.
7. Exit with an appropriate status code.

Seed scripts should be safe to rerun whenever possible.

## Migration Scripts

Migration scripts should be used for controlled database structure or data changes.

Migration scripts should:

- Have a clear name.
- Be executed in a predictable order.
- Be idempotent whenever practical.
- Avoid deleting data unless explicitly required.
- Document irreversible operations.
- Handle errors safely.

Example:

    scripts/database/migrations/
    ├── 001-initial-data.js
    ├── 002-update-user-fields.js
    └── 003-update-course-data.js

## Backup Scripts

Backup scripts should create database backups without exposing credentials or sensitive information in logs.

A backup script should:

- Validate the target database.
- Validate the output location.
- Avoid overwriting existing backups unexpectedly.
- Report backup success or failure.
- Handle connection and filesystem errors.

## Restore Scripts

Restore operations are potentially destructive.

A restore script should:

- Require an explicit backup source.
- Verify the target database.
- Require confirmation before destructive operations.
- Never default to a production database.
- Report the operation result.
- Handle failures safely.

## Destructive Operations

Operations such as database reset, collection deletion, or bulk deletion must not run automatically.

Avoid commands such as:

    deleteMany({})
    dropDatabase()
    drop()

unless the operation is explicitly required and protected by the appropriate environment checks and confirmation.

## Error Handling

Database scripts should fail clearly when:

- `MONGODB_URI` is missing.
- MongoDB cannot be reached.
- Authentication fails.
- Input data is invalid.
- A migration fails.
- A backup cannot be created.
- A restore operation fails.

Errors should be logged without exposing secrets.

## Database Connection Cleanup

Every script that opens a database connection must close it after completion or failure.

Use a `try/catch/finally` structure where appropriate:

    try {
        // Database operation
    } catch (error) {
        // Handle error
    } finally {
        // Close database connection
    }

## Running Database Scripts

Run scripts from the project root when the script uses project-relative paths:

    node scripts/database/<script-name>.js

Example:

    node scripts/database/seed.js

For migrations:

    node scripts/database/migrate.js

Always verify the selected environment before running a database operation.

## Adding a New Database Script

Before adding a new script:

1. Confirm that the operation cannot be handled by an existing script.
2. Choose a clear and descriptive filename.
3. Use the existing project database configuration.
4. Add environment validation.
5. Add proper error handling.
6. Ensure database connections are closed.
7. Protect destructive operations.
8. Update this README when the script introduces a new database workflow.

## Current Status

The `scripts/database` directory currently contains only this README.

No database script should be added solely for the purpose of filling the directory. Add `seed`, `migration`, `backup`, `restore`, or other database scripts only when the project has a concrete requirement for that operation.
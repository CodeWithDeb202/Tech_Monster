# Development Scripts

This directory contains scripts that support local development, development workflows, debugging, project maintenance, and other repetitive developer tasks.

## Purpose

Development scripts should automate repetitive tasks that improve development speed, consistency, and reliability.

Typical operations may include:

- Development environment checks
- Local setup
- Development data preparation
- Code generation
- Local cleanup
- Development utilities
- Project maintenance
- Debugging helpers

## Directory Structure

Recommended structure:

    scripts/
    └── development/
        ├── README.md
        ├── setup.js
        ├── check-env.js
        └── cleanup.js

Add a script only when the operation provides a real development benefit.

## Script Rules

Development scripts must:

- Be safe to run locally.
- Have a clear and descriptive name.
- Use existing project configuration where possible.
- Avoid hard-coded credentials.
- Never contain production secrets.
- Validate required configuration.
- Provide clear output.
- Handle errors properly.
- Avoid unnecessary destructive operations.
- Be repeatable whenever practical.

## Environment Configuration

Development scripts should use local environment configuration.

Sensitive values must never be hard-coded.

Example:

    MONGODB_URI=
    JWT_SECRET=
    CLOUDINARY_API_KEY=

Never commit real credentials, API keys, passwords, access tokens, or other secrets.

## Development Environment Checks

Environment-check scripts may verify:

- Node.js availability
- npm availability
- Required environment variables
- Required project directories
- Required configuration files
- Database availability
- Required dependencies

Example:

    node scripts/development/check-env.js

A failed environment check should clearly explain what is missing.

## Local Setup Scripts

A setup script may automate repetitive local development tasks such as:

- Installing dependencies
- Creating required directories
- Preparing local configuration
- Preparing development data
- Checking required tools

Example:

    node scripts/development/setup.js

Setup scripts should not overwrite existing configuration or user files without explicit confirmation.

## Development Data

Development-only data scripts may create sample data required for local development.

Development data must:

- Be clearly identified as non-production data.
- Never contain real user information.
- Never contain production credentials.
- Be safe to recreate.
- Avoid modifying production databases.

Database-specific scripts should remain inside:

    scripts/database/

## Cleanup Scripts

Cleanup scripts may remove local development artifacts such as:

- Temporary files
- Local logs
- Generated development output
- Temporary caches

Example:

    node scripts/development/cleanup.js

Cleanup scripts must clearly define what they remove.

Never delete production resources or data from a development script.

## Code Generation

Code-generation scripts may be used for repetitive development tasks such as:

- Creating boilerplate files
- Generating development fixtures
- Creating component templates
- Generating configuration files

Generated files should follow the project's existing naming and directory conventions.

## Debugging Utilities

Development debugging scripts may help developers inspect:

- Local configuration
- API connectivity
- Database connectivity
- Development services
- Application state

Debugging scripts must never print sensitive values.

For example, print:

    MONGODB_URI: configured

instead of:

    MONGODB_URI: mongodb+srv://username:password@...

## Error Handling

Development scripts should fail clearly when:

- Required tools are unavailable.
- Required environment variables are missing.
- Dependencies are missing.
- A required service is unavailable.
- A required file does not exist.
- A development operation fails.

Errors should provide enough information to resolve the problem without exposing sensitive information.

## Logging

Development scripts should provide clear and useful terminal output.

Good output should identify:

- Operation being performed
- Current status
- Successful completion
- Failure reason
- Required next step when applicable

Never log:

- Passwords
- API keys
- JWT secrets
- Access tokens
- Database credentials
- Private tokens

## Exit Codes

Scripts should use appropriate process exit codes.

Successful operation:

    process.exit(0)

Failed operation:

    process.exit(1)

A failed development check should return a non-zero exit code when the script is intended to be used by automation.

## Running Development Scripts

Run scripts from the project root when they use project-relative paths:

    node scripts/development/<script-name>.js

Example:

    node scripts/development/check-env.js

## Adding a New Development Script

Before adding a new script:

1. Confirm that the task is repetitive or benefits from automation.
2. Check whether an existing npm command already provides the required functionality.
3. Choose a clear and descriptive filename.
4. Keep the script focused on one responsibility.
5. Use existing project configuration.
6. Validate required inputs.
7. Handle errors properly.
8. Avoid destructive behavior.
9. Never expose secrets.
10. Update this README when the script introduces a new development workflow.

## Script Naming

Use descriptive names based on the operation.

Examples:

    check-env.js
    setup.js
    cleanup.js
    generate-data.js
    verify-config.js
    reset-local.js

Avoid vague names such as:

    helper.js
    test.js
    script.js
    temp.js

## Development Safety

Development scripts must clearly separate local development operations from production operations.

Do not allow a development script to accidentally operate on a production environment.

Before performing database, filesystem, or external-service operations, verify the configured environment.

## Current Status

The `scripts/development` directory currently contains only this README.

No development script should be added simply to fill the directory.

Add scripts only when the project has a concrete repetitive development task that benefits from automation.
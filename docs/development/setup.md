# Development Setup

This guide explains how to set up the Tech Monster project for local development.

## Prerequisites

Before starting development, make sure the following are installed:

- Git
- Node.js
- npm
- MongoDB
- Visual Studio Code or another code editor

Verify the installations:

    git --version
    node --version
    npm --version

## Clone the Repository

Clone the repository and enter the project directory:

    git clone https://github.com/Tech-Monster-Dev/Tech-Monster-Dev.git
    cd Tech-Monster-Dev

## Project Structure

The project is organized into separate frontend, backend, documentation, scripts, and GitHub configuration directories.

    Tech-Monster-Dev/
    ├── frontend/
    ├── backend/
    ├── docs/
    ├── scripts/
    ├── .github/
    ├── .editorconfig
    ├── .gitignore
    ├── CONTRIBUTING.md
    └── README.md

## Backend Setup

Move into the backend directory:

    cd backend

Install the backend dependencies:

    npm install

Start the backend development server:

    npm run dev

Start the backend normally:

    npm start

The backend development server uses Nodemon for automatic restarts.

## Backend Environment Variables

Create the following file:

    backend/.env

Add the environment variables required by the backend configuration.

Example:

    NODE_ENV=development
    PORT=8000
    MONGODB_URI=mongodb://127.0.0.1:27017/tech-monster
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d
    MAINTENANCE_MODE=false

Add external service credentials only when the related features are required:

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    BREVO_API_KEY=
    RESEND_API_KEY=
    EMAIL_FROM=

Never commit real credentials, secrets, API keys, or database passwords.

## MongoDB Setup

The backend uses MongoDB through Mongoose.

### Local MongoDB

Make sure MongoDB is running locally.

Example connection string:

    MONGODB_URI=mongodb://127.0.0.1:27017/tech-monster

### MongoDB Atlas

MongoDB Atlas can also be used:

    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

Make sure the database credentials and network access are configured correctly.

## Frontend Setup

Open a new terminal and move into the frontend directory:

    cd frontend

Install the frontend dependencies:

    npm install

The frontend uses React and Vite.

## Frontend Environment Variables

Create the following file only when frontend environment variables are required:

    frontend/.env

Vite exposes client-side environment variables only when they use the `VITE_` prefix.

Example:

    VITE_API_URL=http://localhost:8000

Do not place private API keys, database credentials, JWT secrets, or server-side secrets in frontend environment variables.

## Start the Frontend

Start the Vite development server:

    npm run dev

Create a production build:

    npm run build

Preview the production build:

    npm run preview

Run ESLint:

    npm run lint

The frontend development server runs on port `5199`.

Frontend URL:

    http://localhost:5199

## Run Frontend and Backend Together

Run the backend and frontend in separate terminals.

### Terminal 1

    cd Tech-Monster-Dev/backend
    npm run dev

### Terminal 2

    cd Tech-Monster-Dev/frontend
    npm run dev

Local development URLs:

    Frontend: http://localhost:5199
    Backend:  http://localhost:8000

## Backend Commands

Run these commands from the `backend` directory:

    npm install
    npm run dev
    npm start
    npm test

| Command | Purpose |
| --- | --- |
| `npm install` | Install backend dependencies |
| `npm run dev` | Start the backend development server |
| `npm start` | Start the backend server |
| `npm test` | Run the backend test command |

## Frontend Commands

Run these commands from the `frontend` directory:

    npm install
    npm run dev
    npm run build
    npm run lint
    npm run preview

| Command | Purpose |
| --- | --- |
| `npm install` | Install frontend dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## API

The backend API is available under:

    http://localhost:8000/api

Health check:

    http://localhost:8000/api/health

API documentation:

    http://localhost:8000/api/docs

## CORS

For local development, the backend must allow the frontend development origin:

    http://localhost:5199

Other configured development origins may include:

    http://localhost:5173
    http://localhost:3000

If the frontend development port changes, update the backend CORS configuration accordingly.

## Real-Time Features

The project uses Socket.IO for real-time communication.

Make sure the backend server is running before testing real-time features.

## File and Media Services

The backend supports file and media processing through services including:

- Multer
- Cloudinary
- Streamifier
- PDFKit

Configure the required external service credentials in `backend/.env` before using features that depend on them.

## Email Services

Email-related features may require the following environment variables:

    BREVO_API_KEY=
    RESEND_API_KEY=
    EMAIL_FROM=

Never commit email credentials to the repository.

## Scheduled Jobs

The backend initializes scheduled jobs when the server starts.

These jobs include:

- Refresh-token cleanup
- Submission-deadline processing

## Maintenance Mode

The backend supports maintenance mode through:

    MAINTENANCE_MODE=false

To enable maintenance mode:

    MAINTENANCE_MODE=true

## Git Workflow

Check the current Git status:

    git status

Update the local `main` branch:

    git checkout main
    git pull origin main

Create a feature branch:

    git checkout -b feature/your-feature-name

Recommended branch prefixes:

    feature/
    fix/
    refactor/
    docs/
    chore/
    test/
    hotfix/

Example:

    git checkout -b feature/course-search

## Dependency Management

Install dependencies:

    npm install

When a lockfile is available and a reproducible installation is required:

    npm ci

Do not manually modify `package-lock.json`.

When dependencies are changed, review both:

    package.json
    package-lock.json

## Environment File Rules

Never commit local environment files containing secrets.

Keep files such as these out of Git:

    .env
    .env.local
    .env.development
    .env.production

Use environment example files with placeholders when required.

Example:

    MONGODB_URI=
    JWT_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

## Code Quality

Before committing frontend changes:

    cd frontend
    npm run lint
    npm run build

Before committing backend changes:

    cd backend
    npm test

Review the complete Git diff:

    git diff

Make sure:

- No secrets are committed.
- No unnecessary generated files are included.
- Debug statements are removed.
- Temporary code is removed.
- Imports are clean.
- Naming follows the project conventions.
- Existing functionality is not unintentionally broken.

## Testing

Run the backend test command:

    cd backend
    npm test

Run frontend linting:

    cd frontend
    npm run lint

Verify the frontend production build:

    cd frontend
    npm run build

## Production Build Verification

Create the frontend production build:

    cd frontend
    npm run build

Preview the production build locally:

    npm run preview

## Backend Verification

Start the backend:

    cd backend
    npm start

Verify the backend root endpoint:

    http://localhost:8000/

Verify the health endpoint:

    http://localhost:8000/api/health

## Pull Request Preparation

Check the current branch:

    git branch

Check the working tree:

    git status

Review changes:

    git diff

Compare the current branch with `main`:

    git diff main...HEAD

Stage the intended changes:

    git add .

Commit using the project convention:

    git commit -m "feat: add feature description"

Push the branch:

    git push -u origin feature/your-feature-name

Create a Pull Request targeting `main`.

## Troubleshooting

### Dependencies Are Missing

Remove `node_modules` and reinstall dependencies.

Linux/macOS:

    rm -rf node_modules
    npm install

Windows PowerShell:

    Remove-Item -Recurse -Force node_modules
    npm install

### Backend Does Not Start

Check the following:

- `backend/.env` exists.
- MongoDB is running.
- `MONGODB_URI` is correct.
- The configured `PORT` is available.
- Node.js and npm are installed correctly.
- Backend dependencies are installed.

Then run:

    npm run dev

### MongoDB Connection Fails

Check:

- MongoDB is running.
- `MONGODB_URI` is correct.
- Database credentials are valid.
- MongoDB Atlas network access is configured when using Atlas.
- The database server is reachable.

### Frontend Cannot Connect to Backend

Make sure the backend is running:

    http://localhost:8000

Check the frontend API configuration:

    VITE_API_URL=http://localhost:8000

Also verify that the backend CORS configuration allows:

    http://localhost:5199

### CORS Errors

Confirm that the frontend origin is included in the backend CORS configuration.

Primary local frontend origin:

    http://localhost:5199

### Port Already in Use

The frontend development server uses:

    5199

The backend uses:

    8000

Stop the process using the required port or configure another available port.

### Environment Variables Are Not Available

Check:

- The `.env` file exists in the correct application directory.
- Variable names are correct.
- Backend environment variables are loaded correctly.
- Frontend variables use the `VITE_` prefix.
- The development server was restarted after changing environment variables.

### Unexpected Git Files

Run:

    git status

Check `.gitignore` and make sure dependencies, environment files, generated files, logs, and local configuration are not accidentally staged.

## First-Time Setup

Clone the repository:

    git clone https://github.com/Tech-Monster-Dev/Tech-Monster-Dev.git
    cd Tech-Monster-Dev

Install backend dependencies:

    cd backend
    npm install

Configure:

    backend/.env

Start MongoDB and run the backend:

    npm run dev

Open another terminal and install frontend dependencies:

    cd Tech-Monster-Dev/frontend
    npm install

Configure frontend environment variables when required and start Vite:

    npm run dev

Local development URLs:

    Frontend:
    http://localhost:5199

    Backend:
    http://localhost:8000

    API:
    http://localhost:8000/api

    API Health:
    http://localhost:8000/api/health

    API Documentation:
    http://localhost:8000/api/docs
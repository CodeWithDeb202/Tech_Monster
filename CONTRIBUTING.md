# Contributing to Tech Monster

Thank you for your interest in contributing to **Tech Monster**.

Tech Monster is developed as a collaborative project, so every contribution
should aim to keep the codebase:

- Clean
- Maintainable
- Secure
- Consistent
- Testable
- Well documented
- Easy for future developers to understand

This document explains the expected development workflow for contributors.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Repository Structure](#repository-structure)
- [Development Requirements](#development-requirements)
- [Getting the Repository](#getting-the-repository)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Branching Strategy](#branching-strategy)
- [Creating a Development Branch](#creating-a-development-branch)
- [Coding Standards](#coding-standards)
- [Frontend Guidelines](#frontend-guidelines)
- [Backend Guidelines](#backend-guidelines)
- [API Development Guidelines](#api-development-guidelines)
- [Database Guidelines](#database-guidelines)
- [Security Guidelines](#security-guidelines)
- [Error Handling](#error-handling)
- [Logging Guidelines](#logging-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Review Guidelines](#code-review-guidelines)
- [Handling Review Feedback](#handling-review-feedback)
- [Keeping Your Branch Updated](#keeping-your-branch-updated)
- [Merge Conflicts](#merge-conflicts)
- [Dependency Changes](#dependency-changes)
- [CI Requirements](#ci-requirements)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [What Not to Commit](#what-not-to-commit)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Documentation Issues](#documentation-issues)
- [Definition of Done](#definition-of-done)
- [Contributor Checklist](#contributor-checklist)

---

# Before You Start

Before making a change, contributors should first understand the existing
project structure.

Do not immediately start modifying files based only on the feature request.

Recommended workflow:

1. Read this document.
2. Read the main `README.md`.
3. Inspect the relevant frontend or backend module.
4. Search for existing implementations of similar functionality.
5. Check existing issues and pull requests.
6. Decide the smallest appropriate change.
7. Implement the change.
8. Test the change.
9. Update documentation if required.
10. Open a focused pull request.

Avoid changing unrelated files simply because you noticed something that could
be improved.

If you discover unrelated technical debt, create a separate issue or pull
request unless it is directly necessary for your current change.

---

# Repository Structure

The repository is organized into major application and development areas.

```text
Tech-Monster-Dev/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   └── Server-side application
│
├── frontend/
│   └── Client-side application
│
├── docs/
│   └── Project and developer documentation
│
├── scripts/
│   └── Development and maintenance automation
│
├── .editorconfig
├── .gitignore
├── .hintrc
├── CONTRIBUTING.md
├── LICENSE
└── README.md
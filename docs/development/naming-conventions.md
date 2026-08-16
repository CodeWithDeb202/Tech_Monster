# Naming Conventions

This document defines the naming standards used across the Tech Monster project.

The goal is to keep the codebase consistent, readable, predictable, and easy to maintain.

---

## 1. General Rules

- Use clear and descriptive names.
- Avoid unnecessary abbreviations.
- Use English for all code, file, folder, variable, function, class, and API names.
- Prefer names that describe intent rather than implementation details.
- Keep naming consistent across frontend, backend, database, and documentation.
- Avoid generic names such as `data`, `temp`, `test`, `value`, or `thing` unless their context is obvious.
- Use singular names for individual entities and plural names for collections.
- Do not use spaces in file or folder names.
- Avoid special characters in file and folder names.
- Use consistent casing according to the rules defined below.

---

## 2. Directory Naming

Use lowercase `kebab-case` for directory names.

### Recommended

```text
src/
├── core/
├── infrastructure/
├── presentation/
├── services/
├── middleware/
├── controllers/
└── routes/
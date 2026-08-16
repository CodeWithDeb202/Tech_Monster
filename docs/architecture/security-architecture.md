# Security Architecture

## Purpose

This document defines the security architecture, security responsibilities, protection mechanisms, and development rules for the Tech Monster application.

The goal is to ensure that developers understand how application data, users, APIs, authentication, authorization, files, external services, and infrastructure must be protected.

---

# Security Architecture Overview

```text
User
  │
  ▼
Frontend
  │
  ▼
API
  │
  ├── CORS
  ├── Rate Limiting
  ├── Authentication
  ├── Authorization
  ├── Validation
  └── Security Middleware
  │
  ▼
Application Services
  │
  ├── Database
  ├── File Storage
  └── External Services
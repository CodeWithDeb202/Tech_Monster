# Request Flow

## Purpose

This document describes how requests move through the Tech Monster application from the frontend to the backend and back to the user interface.

The purpose is to make the request lifecycle clear for developers working on new features, debugging existing functionality, or modifying application architecture.

---

# High-Level Request Flow

```text
User
  ↓
Frontend UI
  ↓
Frontend State / Hook
  ↓
API Service
  ↓
HTTP Request
  ↓
Backend Application
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model / Data Layer
  ↓
Database / External Service
  ↓
Service
  ↓
Controller
  ↓
HTTP Response
  ↓
Frontend API Service
  ↓
State / Hook
  ↓
Component
  ↓
Updated UI
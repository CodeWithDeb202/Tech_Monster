# System Overview

## Purpose

This document provides a high-level overview of the Tech Monster system architecture.

It explains how the major parts of the application work together, how data moves through the system, and where different responsibilities belong.

---

# System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │   React Application │
                         └──────────┬──────────┘
                                    │
                              HTTP / HTTPS
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Backend        │
                         │     REST API        │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │   Database     │ │ File / Cloud   │ │ External APIs  │
        │ Persistent     │ │    Storage     │ │   Services     │
        │ Data           │ │                │ │                │
        └────────────────┘ └────────────────┘ └────────────────┘
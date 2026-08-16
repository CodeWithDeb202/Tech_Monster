# Authentication API

## Base Route

/api/auth

## Endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | Public | Create a new user account |
| POST | /api/auth/login | Public | Authenticate a user |
| POST | /api/auth/verify-otp | Public | Verify OTP |
| POST | /api/auth/resend-otp | Public | Resend OTP |
| POST | /api/auth/forgot-password | Public | Request password reset OTP |
| POST | /api/auth/verify-reset-otp | Public | Verify password reset OTP |
| POST | /api/auth/reset-password | Public | Reset password |
| POST | /api/auth/logout | Protected | Logout current user |
| POST | /api/auth/admin/login | Public | Authenticate an administrator |

---

# 1. Signup

## Endpoint

POST `/api/auth/signup`

## Authentication

Not required.

## Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Strong@123",
  "role": "student"
}
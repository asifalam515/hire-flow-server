# Role-Based Authentication Middleware Guide

This guide covers how to use the role-based authentication middleware with better-auth.

## Overview

The authentication system includes:

- **authenticate** - Verifies user is logged in
- **authorize** - Role-based access control factory
- **requireAdmin** - Admin-only access
- **requireRecruiter** - Recruiter/Admin access
- **requireCandidate** - Candidate/Recruiter/Admin access
- **optionalAuth** - Optional authentication (doesn't fail if not logged in)

## User Roles

Your system has 3 roles (from `prisma/schema.prisma`):

- **CANDIDATE** - Job applicants
- **RECRUITER** - Company recruiters
- **ADMIN** - System administrators

## Usage Examples

### 1. Public Routes (No Auth Required)

```typescript
import { Router } from "express";
import { optionalAuth } from "@middleware/auth.middleware";

const router = Router();

// Route accessible to everyone, but shows different data if authenticated
router.get("/jobs", optionalAuth, (req, res) => {
  if (req.user) {
    // User is logged in - show personalized jobs
    res.json({ jobs: [], userRole: req.user.role });
  } else {
    // Not logged in - show all jobs
    res.json({ jobs: [] });
  }
});
```

### 2. Authenticated Routes (Any Logged-In User)

```typescript
import { authenticate } from "@middleware/auth.middleware";

// User must be logged in
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### 3. Role-Specific Routes

#### Admin Only

```typescript
import { requireAdmin } from "@middleware/auth.middleware";

router.get("/admin/users", requireAdmin, (req, res) => {
  // Only ADMIN can access
  res.json({ message: "Admin users list" });
});
```

#### Recruiter and Admin

```typescript
import { requireRecruiter } from "@middleware/auth.middleware";

router.post("/jobs", requireRecruiter, (req, res) => {
  // Both RECRUITER and ADMIN can create jobs
  res.json({ message: "Job created" });
});
```

#### Candidate, Recruiter, and Admin

```typescript
import { requireCandidate } from "@middleware/auth.middleware";

router.post("/jobs/:jobId/apply", requireCandidate, (req, res) => {
  // Everyone can apply (CANDIDATE primary, but RECRUITER/ADMIN can too)
  res.json({ message: "Application submitted" });
});
```

### 4. Custom Role Authorization

```typescript
import { authorize } from "@middleware/auth.middleware";

// Allow only specific roles
router.delete("/jobs/:jobId", authorize(["ADMIN"]), (req, res) => {
  // Only ADMIN can delete jobs
  res.json({ message: "Job deleted" });
});

// Allow multiple roles
router.patch("/jobs/:jobId", authorize(["RECRUITER", "ADMIN"]), (req, res) => {
  // RECRUITER and ADMIN can update jobs
  res.json({ message: "Job updated" });
});
```

### 5. Using with Async Handlers

```typescript
import { asyncHandler } from "@lib/asyncHandler";

router.post(
  "/jobs",
  requireRecruiter,
  asyncHandler(async (req, res) => {
    // req.user is automatically available
    const job = await prisma.job.create({
      data: {
        ...req.body,
        recruiterId: req.user.id, // Type-safe access
      },
    });
    res.json({ job });
  }),
);
```

## TypeScript Types

The middleware automatically extends Express Request with user information:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role; // "CANDIDATE" | "RECRUITER" | "ADMIN"
        emailVerified: boolean;
        image?: string | null;
      };
    }
  }
}

// Now in your route handlers:
router.get("/profile", authenticate, (req, res) => {
  // req.user is fully typed!
  const userId: string = req.user!.id;
  const role: Role = req.user!.role;
});
```

## How It Works

1. **authenticate middleware**
   - Extracts the Bearer token from the `Authorization` header
   - Verifies it with better-auth
   - Attaches user data to `req.user`
   - Returns 401 if invalid/expired

2. **authorize middleware factory**
   - Must run after `authenticate`
   - Checks if user's role is in the allowed list
   - Returns 403 if role doesn't match
   - Returns 401 if user is not authenticated

3. **optionalAuth middleware**
   - Attempts to authenticate but doesn't fail if token is missing
   - Useful for routes that work with or without auth

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "No session token provided" // or "Invalid or expired session"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Required roles: ADMIN"
}
```

## Complete Example Router

See [Job.router.ts](./Job.router.ts) for a complete example with all middleware variations.

## Client-Side Usage

When calling protected endpoints, include the session token:

```typescript
// After user logs in via better-auth, get the session
const session = await getSession(); // from better-auth client

// Send requests with the Bearer token
const response = await fetch("/api/jobs", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${session.session.token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ title: "Job Title" }),
});
```

## Best Practices

1. **Always authenticate before authorizing**

   ```typescript
   // ✅ Correct
   router.post("/admin", authenticate, requireAdmin, handler);

   // ❌ Wrong - will error if user not authenticated
   router.post("/admin", requireAdmin, handler);
   ```

2. **Use specific role middleware when possible**

   ```typescript
   // ✅ Clear intent
   router.post("/jobs", requireRecruiter, handler);

   // ⚠️ Works but less clear
   router.post("/jobs", authorize(["RECRUITER", "ADMIN"]), handler);
   ```

3. **Handle role hierarchy**

   ```typescript
   // ✅ Admin can do everything a Recruiter can do
   const requireRecruiter = authorize(["RECRUITER", "ADMIN"]);
   ```

4. **Log authentication events**
   ```typescript
   router.post("/jobs", requireRecruiter, (req, res) => {
     console.log(`Job created by ${req.user?.email} (${req.user?.role})`);
   });
   ```

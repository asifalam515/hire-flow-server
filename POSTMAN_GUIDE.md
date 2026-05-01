# HireFlow Postman Collection Guide

Complete API collection for testing HireFlow platform.

## Setup Instructions

### 1. Import Collection in Postman

1. Open **Postman**
2. Click **File** → **Import**
3. Select `HireFlow-Postman-Collection.json`
4. Collection is now imported ✅

### 2. Configure Environment Variables

Before making requests, set the variables:

**In Postman → Collections → HireFlow → Variables:**

| Variable       | Value                       | Notes                         |
| -------------- | --------------------------- | ----------------------------- |
| `base_url`     | `http://localhost:3000/api` | Or your Vercel deployment URL |
| `access_token` | Your JWT token              | Get from Sign In response     |

### 3. Getting Started

#### Step 1: Sign Up or Sign In

- Go to **Auth** folder
- Use **Sign Up** to create an account OR **Sign In** to get access token
- Copy the returned token and paste into `access_token` variable

#### Step 2: Create a Company (Recruiter only)

- Go to **Companies** → **Create Company**
- Fill in required fields
- Send request

#### Step 3: Create a Job

- Go to **Jobs** → **Create Job**
- Use company ID from previous step
- Fill in job details
- Send request

#### Step 4: Browse Jobs & Apply (Candidate)

- Go to **Jobs** → **Search & Filter Jobs**
- Go to **Applications** → **Submit Application**

---

## API Endpoints Overview

### Auth

- `POST /auth/sign-up` - Create new account
- `POST /auth/sign-in` - Login and get token
- `POST /auth/sign-out` - Logout

### Companies

- `GET /companies` - List all companies
- `GET /companies/:id` - Get company details
- `POST /companies` - Create new company (requires auth)
- `PATCH /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Jobs

- `GET /jobs` - Search & filter jobs
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job (recruiter only)
- `PATCH /jobs/:id` - Update job
- `PATCH /jobs/:id/status` - Update job status
- `DELETE /jobs/:id` - Delete job
- `GET /jobs/:id/match-score` - Calculate match score

### Applications

- `POST /applications` - Submit job application
- `GET /applications` - Get my applications
- `GET /applications/job/:jobId` - Get applicants for a job (recruiter)
- `PUT /applications/:id/stage` - Move application to new stage
- `POST /applications/:id/labels` - Add label to application
- `DELETE /applications/:id/labels` - Remove label

### Candidate Profile

- `GET /profile` - Get my profile
- `POST /profile` - Create/update profile
- `POST /profile/avatar` - Upload profile picture

### Work Experience & Education

- `POST /work-experience` - Add work experience
- `GET /work-experience` - Get work history
- `PUT /work-experience/:id` - Update work experience
- `DELETE /work-experience/:id` - Delete work experience

- `POST /education` - Add education
- `GET /education` - Get education history
- `PUT /education/:id` - Update education
- `DELETE /education/:id` - Delete education

### Saved Jobs

- `POST /saved-jobs` - Save a job
- `GET /saved-jobs` - Get saved jobs
- `DELETE /saved-jobs/:jobId` - Remove saved job

### Notifications

- `GET /notifications` - Get notifications
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/read-all` - Mark all as read

### Admin

- `GET /admin/users` - List all users
- `PATCH /admin/users/:id/suspend` - Suspend user
- `PATCH /admin/users/:id/role` - Assign user role
- `GET /admin/jobs/pending` - Get pending jobs
- `PATCH /admin/jobs/:id/moderate` - Approve/reject job
- `PATCH /admin/jobs/:id/force-close` - Force close job
- `GET /admin/analytics` - Get platform analytics
- `GET /admin/companies/pending` - Get pending company verifications
- `PATCH /admin/companies/:id/verify` - Verify company
- `GET /admin/audit-trail` - View admin action logs
- `GET /admin/search` - Global admin search

### File Uploads

- `POST /uploads/resume/signed-url` - Get Cloudinary signed URL for resume
- `POST /uploads/avatar/signed-url` - Get signed URL for avatar
- `POST /uploads/resume/confirm` - Confirm resume upload
- `POST /uploads/avatar/confirm` - Confirm avatar upload
- `DELETE /uploads/:publicId` - Delete file

### Search & Tags

- `GET /search/suggestions` - Get search suggestions
- `GET /search/trending` - Get trending searches
- `GET /tags/skills/popular` - Get popular skills
- `GET /tags/skills` - Search skills

### Analytics

- `GET /analytics/jobs/:jobId` - Get job analytics
- `GET /analytics/companies/:companyId` - Get company analytics

### Team & Invites

- `POST /companies/invites` - Invite team member
- `GET /companies/invites` - Get pending invites
- `POST /companies/join` - Accept invite
- `PATCH /companies/invites/:id` - Update invite role
- `DELETE /companies/invites/:id` - Delete invite

### Email Templates

- `GET /companies/:id/email-templates` - Get email templates
- `POST /companies/:id/email-templates` - Create template
- `PUT /companies/:id/email-templates/:templateId` - Update template
- `DELETE /companies/:id/email-templates/:templateId` - Delete template

---

## User Roles & Permissions

| Role          | Permissions                                                                |
| ------------- | -------------------------------------------------------------------------- |
| **CANDIDATE** | Browse jobs, apply, manage profile, save jobs, view own applications       |
| **RECRUITER** | Create jobs, view applicants, manage applications, manage company          |
| **ADMIN**     | Suspend users, verify companies, moderate jobs, view audit logs, analytics |

---

## Common Testing Workflows

### 1. Candidate Workflow

1. Sign Up as candidate
2. Create profile with education & work experience
3. Search and browse jobs
4. Save jobs
5. Apply to jobs
6. Check application status in notifications

### 2. Recruiter Workflow

1. Sign Up as recruiter
2. Create company
3. Create and publish job postings
4. View applicants
5. Move applicants through stages (Screening → Interview → Offer → Hired)
6. Send interview invitations

### 3. Admin Workflow

1. Sign In as admin (or assign ADMIN role to user)
2. View and moderate pending jobs
3. Verify pending companies
4. Suspend/manage users
5. Check admin audit trail for compliance

---

## Environment Setup

### For Local Development

```bash
base_url: http://localhost:3000/api
```

### For Vercel Production

```bash
base_url: https://your-vercel-domain.vercel.app/api
```

---

## Response Examples

### Successful Job Creation

```json
{
  "success": true,
  "data": {
    "id": "job-123",
    "title": "Senior Backend Developer",
    "status": "DRAFT",
    "createdAt": "2026-04-30T10:00:00Z"
  }
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Tips for Testing

1. **Use Comments**: Add test notes in Postman
2. **Tests Scripts**: Add validation scripts to auto-check responses
3. **Collections Runner**: Run entire folder at once with different data
4. **Environments**: Create separate environments for dev/staging/prod
5. **Mock Data**: Generate test data using faker libraries

---

## Troubleshooting

| Issue            | Solution                                   |
| ---------------- | ------------------------------------------ |
| 401 Unauthorized | Check your `access_token` is set correctly |
| 403 Forbidden    | Verify user has required role for endpoint |
| 404 Not Found    | Ensure entity IDs exist in database        |
| 400 Bad Request  | Check request body JSON format             |

---

## Database Relationships

- **User** → can have multiple applications, work experiences, educations
- **Company** → can have multiple jobs, team members, email templates
- **Job** → has multiple applications, linked to company
- **Application** → linked to job and candidate, has multiple interviews

---

**Happy Testing! 🚀**

/*
  Warnings:

  - You are about to drop the `application_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `educations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email_verifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_analytics_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `platform_daily_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saved_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `work_experiences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "application_notes" DROP CONSTRAINT "application_notes_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "application_notes" DROP CONSTRAINT "application_notes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_jobId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_changedById_fkey";

-- DropForeignKey
ALTER TABLE "candidate_profiles" DROP CONSTRAINT "candidate_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "company_members" DROP CONSTRAINT "company_members_companyId_fkey";

-- DropForeignKey
ALTER TABLE "company_members" DROP CONSTRAINT "company_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "educations" DROP CONSTRAINT "educations_profileId_fkey";

-- DropForeignKey
ALTER TABLE "interviews" DROP CONSTRAINT "interviews_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "interviews" DROP CONSTRAINT "interviews_scheduledById_fkey";

-- DropForeignKey
ALTER TABLE "job_alerts" DROP CONSTRAINT "job_alerts_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_companyId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "saved_jobs" DROP CONSTRAINT "saved_jobs_jobId_fkey";

-- DropForeignKey
ALTER TABLE "saved_jobs" DROP CONSTRAINT "saved_jobs_userId_fkey";

-- DropForeignKey
ALTER TABLE "work_experiences" DROP CONSTRAINT "work_experiences_profileId_fkey";

-- DropTable
DROP TABLE "application_notes";

-- DropTable
DROP TABLE "applications";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "candidate_profiles";

-- DropTable
DROP TABLE "companies";

-- DropTable
DROP TABLE "company_members";

-- DropTable
DROP TABLE "educations";

-- DropTable
DROP TABLE "email_verifications";

-- DropTable
DROP TABLE "interviews";

-- DropTable
DROP TABLE "job_alerts";

-- DropTable
DROP TABLE "job_analytics_snapshots";

-- DropTable
DROP TABLE "jobs";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "password_resets";

-- DropTable
DROP TABLE "platform_daily_stats";

-- DropTable
DROP TABLE "refresh_tokens";

-- DropTable
DROP TABLE "saved_jobs";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "work_experiences";

-- DropEnum
DROP TYPE "AlertFrequency";

-- DropEnum
DROP TYPE "ApplicationStage";

-- DropEnum
DROP TYPE "CompanySize";

-- DropEnum
DROP TYPE "ExperienceLevel";

-- DropEnum
DROP TYPE "InterviewType";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CANDIDATE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

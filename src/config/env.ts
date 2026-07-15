import 'dotenv/config';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema — every required variable must be present at boot time.
// ---------------------------------------------------------------------------
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8050),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  REDIS_URL: z.string().url('REDIS_URL must be a valid Redis connection string'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  RESEND_API_KEY: z.string().default('re_dummy_test_key_for_development'),
  EMAIL_FROM: z.string().default('onboarding@resend.dev'),
  CLOUDINARY_CLOUD_NAME: z.string().default('demo_cloud_name'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('dummy_secret_for_development'),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error('❌  Invalid environment variables:\n', _parsed.error.format());
  process.exit(1);
}

/** Validated, strongly-typed environment configuration. */
export const env = Object.freeze(_parsed.data);

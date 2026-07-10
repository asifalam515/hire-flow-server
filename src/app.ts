import 'express-async-errors'; // Patches Express to forward async rejections to next()
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter } from './routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

// ---------------------------------------------------------------------------
// Express Application Factory
// ---------------------------------------------------------------------------
// Separating the app from the server entry-point (`server.ts`) makes the
// application easily testable — tests can import `app` without binding to a port.
// ---------------------------------------------------------------------------

const app: Application = express();

// ── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (origin === undefined || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true, // Required for HttpOnly cookie refresh tokens
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Trust Proxy (for deployments behind nginx / load balancers) ──────────────
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ── 404 Catch-All ────────────────────────────────────────────────────────────
// Registered after all valid routes so only unmatched requests reach it.
app.use(notFoundHandler);

// ── Centralised Error Handler ─────────────────────────────────────────────────
// MUST be the last middleware registered. The 4-argument signature is required
// by Express to recognise it as an error-handling middleware.
app.use(errorHandler);

export { app };

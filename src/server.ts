import http from 'http';
import { env } from './config/env';
import { app } from './app';
import { prisma } from './config/prisma';
import { redis } from './config/redis';

// ---------------------------------------------------------------------------
// HTTP Server
// ---------------------------------------------------------------------------
const server = http.createServer(app);

// ---------------------------------------------------------------------------
// Graceful Shutdown
// ---------------------------------------------------------------------------
// A well-behaved server:
//   1. Stops accepting new connections.
//   2. Waits for in-flight requests to complete (within a timeout).
//   3. Closes database and cache connections cleanly.
//   4. Exits the process with code 0 on success, 1 on failure.
// ---------------------------------------------------------------------------

const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 10_000; // 10 seconds

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`\n📡  Received ${signal}. Starting graceful shutdown…`);

  // Force-kill after timeout to prevent hanging forever.
  const forceKillTimer = setTimeout(() => {
    console.error('❌  Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, GRACEFUL_SHUTDOWN_TIMEOUT_MS);

  // Don't let the timer keep the event loop alive.
  forceKillTimer.unref();

  try {
    // 1. Stop accepting new HTTP connections.
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    console.log('✅  HTTP server closed');

    // 2. Disconnect Prisma (closes DB connection pool).
    await prisma.$disconnect();
    console.log('✅  Prisma disconnected');

    // 3. Quit Redis gracefully.
    await redis.quit();
    console.log('✅  Redis disconnected');

    console.log('🎉  Graceful shutdown complete. Goodbye!');
    process.exit(0);
  } catch (err) {
    console.error('❌  Error during shutdown:', err);
    process.exit(1);
  }
}

// Handle OS termination signals.
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// Handle uncaught promise rejections to prevent silent failures.
process.on('unhandledRejection', (reason: unknown) => {
  console.error('🔥  UNHANDLED PROMISE REJECTION:', reason);
  // Trigger a graceful shutdown so connections are cleaned up.
  void shutdown('SIGTERM');
});

// Handle uncaught synchronous exceptions.
process.on('uncaughtException', (err: Error) => {
  console.error('🔥  UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
async function bootstrap(): Promise<void> {
  try {
    // Verify database connectivity before accepting traffic.
    await prisma.$connect();
    console.log('✅  Database connected');

    // Connect Redis.
    await redis.connect();

    // Start listening.
    server.listen(env.PORT, () => {
      console.log(
        `🚀  Hire-Flow API running on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
      );
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
}

void bootstrap();

export { server };

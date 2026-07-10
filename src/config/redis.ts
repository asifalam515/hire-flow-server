import Redis from 'ioredis';
import { env } from './env';

// ---------------------------------------------------------------------------
// Singleton Redis Client (ioredis)
// ---------------------------------------------------------------------------
// A single connection is shared across the application. ioredis automatically
// handles reconnection with exponential backoff.
// ---------------------------------------------------------------------------

const createRedisClient = (): Redis => {
  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,    // Required by BullMQ
    lazyConnect: true,
  });

  client.on('connect', () => console.log('✅  Redis connected'));
  client.on('ready', () => console.log('✅  Redis ready'));
  client.on('error', (err: Error) => console.error('❌  Redis error:', err.message));
  client.on('close', () => console.warn('⚠️   Redis connection closed'));
  client.on('reconnecting', () => console.log('🔄  Redis reconnecting…'));

  return client;
};

export const redis: Redis = createRedisClient();

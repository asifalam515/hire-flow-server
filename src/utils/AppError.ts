/**
 * Custom application error class.
 *
 * Throw this from services and controllers to communicate known,
 * user-facing error conditions to the centralized error handler.
 *
 * @example
 *   throw new AppError('Job not found', 404);
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains a proper prototype chain for `instanceof` checks in TypeScript.
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

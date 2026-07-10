import { Request, Response } from 'express';

export class HealthController {
  public check = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'Hire-Flow API is running',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] ?? 'unknown',
    });
  };
}

export const healthController = new HealthController();

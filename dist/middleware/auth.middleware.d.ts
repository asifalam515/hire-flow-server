import type { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/enums";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: Role;
                emailVerified: boolean;
                image?: string | null;
            };
        }
    }
}
/**
 * Authenticate middleware - verifies user is logged in
 * Extracts and validates session from headers
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Role-based authorization middleware factory
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 *
 * @example
 * router.get('/admin', authorize(['ADMIN']), controller.handler);
 * router.post('/jobs', authorize(['RECRUITER', 'ADMIN']), controller.createJob);
 */
export declare const authorize: (allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Specific role middlewares for convenience
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRecruiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireCandidate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional auth middleware - doesn't fail if user is not logged in
 * Useful for routes that work with or without authentication
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map
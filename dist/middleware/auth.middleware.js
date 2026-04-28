import { AppError } from "@lib/appError";
import { auth } from "@lib/auth";
/**
 * Authenticate middleware - verifies user is logged in
 * Extracts and validates session from headers
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get session from headers
        const sessionHeader = req.headers.authorization?.replace("Bearer ", "");
        if (!sessionHeader) {
            throw new AppError("No session token provided", 401);
        }
        // Verify session with better-auth
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (!session?.user) {
            throw new AppError("Invalid or expired session", 401);
        }
        // Attach user to request
        req.user = session.user;
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }
    }
};
/**
 * Role-based authorization middleware factory
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 *
 * @example
 * router.get('/admin', authorize(['ADMIN']), controller.handler);
 * router.post('/jobs', authorize(['RECRUITER', 'ADMIN']), controller.createJob);
 */
export const authorize = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError("User not authenticated", 401);
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw new AppError(`Access denied. Required roles: ${allowedRoles.join(", ")}`, 403);
            }
            next();
        }
        catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(403).json({
                    success: false,
                    message: "Authorization failed",
                });
            }
        }
    };
};
/**
 * Specific role middlewares for convenience
 */
export const requireAdmin = authorize(["ADMIN"]);
export const requireRecruiter = authorize(["RECRUITER", "ADMIN"]);
export const requireCandidate = authorize(["CANDIDATE", "RECRUITER", "ADMIN"]);
/**
 * Optional auth middleware - doesn't fail if user is not logged in
 * Useful for routes that work with or without authentication
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const sessionHeader = req.headers.authorization?.replace("Bearer ", "");
        if (sessionHeader) {
            const session = await auth.api.getSession({
                headers: req.headers,
            });
            if (session?.user) {
                req.user = session.user;
            }
        }
        next();
    }
    catch (error) {
        // Silently fail and continue - auth is optional
        next();
    }
};
//# sourceMappingURL=auth.middleware.js.map
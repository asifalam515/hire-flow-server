import { AppError } from "../lib/appError";
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
};
//# sourceMappingURL=errorHandler.js.map
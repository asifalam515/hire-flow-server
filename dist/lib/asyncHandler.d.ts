import type { NextFunction, Request, RequestHandler, Response } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (handler: AsyncRequestHandler) => RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map
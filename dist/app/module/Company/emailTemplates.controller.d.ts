import { Request, Response } from "express";
export declare const createTemplate: (req: Request, res: Response) => Promise<void>;
export declare const getTemplates: (req: Request, res: Response) => Promise<void>;
export declare const updateTemplate: (req: Request, res: Response) => Promise<void>;
export declare const deleteTemplate: (req: Request, res: Response) => Promise<void>;
export declare const emailTemplatesController: {
    createTemplate: (req: Request, res: Response) => Promise<void>;
    getTemplates: (req: Request, res: Response) => Promise<void>;
    updateTemplate: (req: Request, res: Response) => Promise<void>;
    deleteTemplate: (req: Request, res: Response) => Promise<void>;
};
export default emailTemplatesController;
//# sourceMappingURL=emailTemplates.controller.d.ts.map
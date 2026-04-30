import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
import { Request, Response } from "express";
import { emailTemplatesService } from "./emailTemplates.service";

const ensureCompanyMember = async (companyId: string, userId: string) => {
  const member = await prisma.companyMember.findFirst({
    where: { companyId, userId },
  });
  return !!member;
};

export const createTemplate = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  const userId = (req as any).user?.id;

  if (!userId) throw new AppError("Unauthorized", 401);

  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);

  const { name, subject, body, stage, isDefault } = req.body;

  const tpl = await emailTemplatesService.createTemplate(companyId, {
    name,
    subject,
    body,
    stage,
    isDefault,
  });

  res.json(tpl);
};

export const getTemplates = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  const templates = await emailTemplatesService.getTemplates(companyId);
  res.json(templates);
};

export const updateTemplate = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  const templateId = req.params.templateId;
  const userId = (req as any).user?.id;

  if (!userId) throw new AppError("Unauthorized", 401);
  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);

  const payload = req.body;
  const updated = await emailTemplatesService.updateTemplate(
    companyId,
    templateId,
    payload,
  );
  res.json(updated);
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  const templateId = req.params.templateId;
  const userId = (req as any).user?.id;

  if (!userId) throw new AppError("Unauthorized", 401);
  const isMember = await ensureCompanyMember(companyId, userId);
  if (!isMember)
    throw new AppError("You are not a member of this company", 403);

  const result = await emailTemplatesService.deleteTemplate(
    companyId,
    templateId,
  );
  res.json(result);
};

export const emailTemplatesController = {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
};

export default emailTemplatesController;

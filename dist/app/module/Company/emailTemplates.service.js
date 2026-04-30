import { AppError } from "@lib/appError";
import { prisma } from "@lib/prisma";
const createTemplate = async (companyId, payload) => {
    // If isDefault true, unset other defaults for this company
    if (payload.isDefault) {
        await prisma.emailTemplate.updateMany({
            where: { companyId, isDefault: true },
            data: { isDefault: false },
        });
    }
    const t = await prisma.emailTemplate.create({
        data: {
            companyId,
            name: payload.name,
            subject: payload.subject,
            body: payload.body,
            stage: payload.stage,
            isDefault: payload.isDefault ?? false,
        },
    });
    return t;
};
const getTemplates = async (companyId) => {
    return await prisma.emailTemplate.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
    });
};
const updateTemplate = async (companyId, templateId, payload) => {
    const tpl = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
    });
    if (!tpl || tpl.companyId !== companyId) {
        throw new AppError("Template not found", 404);
    }
    if (payload.isDefault) {
        await prisma.emailTemplate.updateMany({
            where: { companyId, isDefault: true },
            data: { isDefault: false },
        });
    }
    const updated = await prisma.emailTemplate.update({
        where: { id: templateId },
        data: {
            ...(payload.name !== undefined && { name: payload.name }),
            ...(payload.subject !== undefined && { subject: payload.subject }),
            ...(payload.body !== undefined && { body: payload.body }),
            ...(payload.stage !== undefined && { stage: payload.stage }),
            ...(payload.isDefault !== undefined && { isDefault: payload.isDefault }),
        },
    });
    return updated;
};
const deleteTemplate = async (companyId, templateId) => {
    const tpl = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
    });
    if (!tpl || tpl.companyId !== companyId) {
        throw new AppError("Template not found", 404);
    }
    await prisma.emailTemplate.delete({ where: { id: templateId } });
    return { success: true };
};
const applyVariables = (text, vars) => {
    let out = text;
    for (const k of Object.keys(vars)) {
        const v = vars[k] ?? "";
        const re = new RegExp(`{{\\s*${k}\\s*}}`, "g");
        out = out.replace(re, String(v));
    }
    return out;
};
const resolveTemplate = async (companyId, stage, variables = {}) => {
    // Try to find template for the stage
    let tpl = null;
    if (stage) {
        tpl = await prisma.emailTemplate.findFirst({ where: { companyId, stage } });
    }
    if (!tpl) {
        // fallback to company's default template
        tpl = await prisma.emailTemplate.findFirst({
            where: { companyId, isDefault: true },
        });
    }
    if (tpl) {
        const subject = applyVariables(tpl.subject, variables);
        const body = applyVariables(tpl.body, variables);
        return { subject, body };
    }
    // final fallback: hardcoded default
    const defaultSubject = "Application update: {{jobTitle}} — {{stage}}";
    const defaultBody = `<p>Hi {{candidateName}},</p><p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> is now in <strong>{{stage}}</strong> stage.</p><p>Regards,<br/>{{companyName}}</p>`;
    return {
        subject: applyVariables(defaultSubject, variables),
        body: applyVariables(defaultBody, variables),
    };
};
export const emailTemplatesService = {
    createTemplate,
    getTemplates,
    updateTemplate,
    deleteTemplate,
    resolveTemplate,
};
export default emailTemplatesService;
//# sourceMappingURL=emailTemplates.service.js.map
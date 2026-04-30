import { emailTemplatesService } from "@/app/module/Company/emailTemplates.service";
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

if (host && port && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });
} else {
  // fallback to console logging
  transporter = null;
}

export const sendMail = async (
  to: string,
  subject: string,
  html: string,
  text?: string,
) => {
  if (!transporter) {
    console.log("[mailer] sendMail fallback — no SMTP configured");
    console.log({ to, subject, text, html });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `no-reply@example.com`,
    to,
    subject,
    text: text ?? undefined,
    html,
  });
};

export const sendStageChangeEmail = async (
  companyId: string,
  to: string,
  variables: {
    candidateName?: string;
    jobTitle?: string;
    companyName?: string;
    stage?: string;
  },
) => {
  const resolved = await emailTemplatesService.resolveTemplate(
    companyId,
    variables.stage,
    variables as any,
  );
  await sendMail(to, resolved.subject, resolved.body as string);
};

export default sendMail;

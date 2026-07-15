import { Resend } from 'resend';
import { env } from '../config/env';

export interface SendOtpEmailOptions {
  to: string;
  otpCode: string;
  firstName?: string | undefined;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
}

/**
 * Send a verification OTP email via Resend (or simulate cleanly in local development).
 */
export const sendVerificationOtpEmail = async (
  options: SendOtpEmailOptions,
): Promise<EmailSendResult> => {
  const { to, otpCode, firstName } = options;
  const greeting = firstName ? `Hi ${firstName},` : 'Hello,';

  // If running with the default dev key, simulate dispatch cleanly
  if (
    !env.RESEND_API_KEY ||
    env.RESEND_API_KEY.startsWith('re_dummy') ||
    env.NODE_ENV === 'test'
  ) {
    console.log(`\n=============================================================`);
    console.log(`[Resend Dev Simulation] Email to: ${to}`);
    console.log(`[Resend Dev Simulation] Subject: Verify your Joblin employer account`);
    console.log(`[Resend Dev Simulation] OTP Code: ${otpCode}`);
    console.log(`=============================================================\n`);
    return {
      success: true,
      id: `dev_simulated_${Date.now()}`,
    };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 36px; border: 1px solid #e4e4e7; border-radius: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #09090b;">Joblin</span>
      </div>
      <h2 style="color: #09090b; font-size: 22px; font-weight: 800; margin-bottom: 12px; text-align: center;">Verify your email address</h2>
      <p style="color: #52525b; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        ${greeting} please use the 4-digit verification code below to verify your recruiter account and complete your onboarding on Joblin:
      </p>
      <div style="background-color: #f4f4f5; padding: 24px; border-radius: 16px; text-align: center; margin: 28px 0; border: 1px dashed #d4d4d8;">
        <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #2563eb; margin-left: 12px;">${otpCode}</span>
      </div>
      <p style="color: #71717a; font-size: 13px; line-height: 1.5; text-align: center; margin-top: 24px;">
        This verification code will expire in <strong>10 minutes</strong>.<br />
        If you did not initiate this request, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [to],
      subject: `${otpCode} is your Joblin verification code`,
      html: htmlContent,
    });

    if (response.error) {
      console.error('❌ Resend API Error:', response.error);
      return { success: false };
    }

    return {
      success: true,
      id: response.data?.id,
    };
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    return { success: false };
  }
};

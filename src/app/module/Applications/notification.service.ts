import { sendMail } from "@lib/mailer";

interface ApplicationEmailContext {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  applicationId?: string;
  stage?: string;
  interviewDetails?: {
    type?: string;
    dateTime?: Date;
    location?: string;
    meetingUrl?: string;
  };
  salaryOffer?: number;
  salaryCurrency?: string;
}

/**
 * Send email when application is received (to recruiter)
 */
export const sendApplicationReceivedEmail = async (
  recruiterEmail: string,
  recruiterName: string,
  context: ApplicationEmailContext,
) => {
  const subject = `New Application: ${context.jobTitle}`;
  const html = `
    <p>Hi ${recruiterName},</p>
    <p><strong>${context.candidateName}</strong> has applied for the <strong>${context.jobTitle}</strong> position at <strong>${context.companyName}</strong>.</p>
    <p>
      <strong>Candidate Email:</strong> ${context.candidateEmail}<br/>
      <strong>Job Title:</strong> ${context.jobTitle}<br/>
      <strong>Company:</strong> ${context.companyName}
    </p>
    <p>Log in to review the application and take action.</p>
    <p>Regards,<br/>HireFlow Team</p>
  `;

  try {
    await sendMail(recruiterEmail, subject, html);
  } catch (err) {
    console.error("Failed to send application received email", err);
  }
};

/**
 * Send email when application stage is updated (to candidate)
 */
export const sendApplicationStageUpdateEmail = async (
  candidateEmail: string,
  candidateName: string,
  context: ApplicationEmailContext,
) => {
  const stageMessages: { [key: string]: string } = {
    SCREENING: "moved to the screening stage",
    ASSESSMENT: "moved to the assessment stage",
    INTERVIEW: "advanced to the interview stage",
    OFFER: "received an offer",
    HIRED: "been hired",
    REJECTED: "not moved forward at this time",
    WITHDRAWN: "been withdrawn",
  };

  const stageMessage = stageMessages[context.stage || ""] || "been updated";

  const subject = `Application Update: ${context.jobTitle} — ${context.stage}`;
  const html = `
    <p>Hi ${candidateName},</p>
    <p>Good news! Your application for <strong>${context.jobTitle}</strong> at <strong>${context.companyName}</strong> has ${stageMessage}.</p>
    ${context.stage === "HIRED" ? "<p>Congratulations on your new role! We're excited to have you on board.</p>" : ""}
    ${context.stage === "REJECTED" ? "<p>We appreciate your interest and encourage you to apply for future positions that match your skills.</p>" : ""}
    <p>Regards,<br/>${context.companyName}</p>
  `;

  try {
    await sendMail(candidateEmail, subject, html);
  } catch (err) {
    console.error("Failed to send stage update email", err);
  }
};

/**
 * Send email when interview is scheduled (to candidate)
 */
export const sendInterviewScheduledEmail = async (
  candidateEmail: string,
  candidateName: string,
  context: ApplicationEmailContext,
) => {
  const interviewType = context.interviewDetails?.type || "Interview";
  const dateTime = context.interviewDetails?.dateTime
    ? new Date(context.interviewDetails.dateTime).toLocaleString()
    : "TBD";
  const location = context.interviewDetails?.location || "To be confirmed";
  const meetingUrl = context.interviewDetails?.meetingUrl
    ? `<p><strong>Meeting Link:</strong> <a href="${context.interviewDetails.meetingUrl}">${context.interviewDetails.meetingUrl}</a></p>`
    : "";

  const subject = `Interview Scheduled: ${context.jobTitle} at ${context.companyName}`;
  const html = `
    <p>Hi ${candidateName},</p>
    <p>Great news! We would like to invite you for an interview for the <strong>${context.jobTitle}</strong> position at <strong>${context.companyName}</strong>.</p>
    <p>
      <strong>Interview Type:</strong> ${interviewType}<br/>
      <strong>Date & Time:</strong> ${dateTime}<br/>
      <strong>Location:</strong> ${location}
    </p>
    ${meetingUrl}
    <p>Please confirm your availability and let us know if you have any questions.</p>
    <p>Regards,<br/>${context.companyName}</p>
  `;

  try {
    await sendMail(candidateEmail, subject, html);
  } catch (err) {
    console.error("Failed to send interview scheduled email", err);
  }
};

/**
 * Send email when offer is extended (to candidate)
 */
export const sendOfferExtendedEmail = async (
  candidateEmail: string,
  candidateName: string,
  context: ApplicationEmailContext,
) => {
  const salary = context.salaryOffer
    ? `${context.salaryCurrency || "USD"} ${context.salaryOffer.toLocaleString()}/year`
    : "Competitive";

  const subject = `Job Offer: ${context.jobTitle} at ${context.companyName}`;
  const html = `
    <p>Hi ${candidateName},</p>
    <p>We're excited to offer you the position of <strong>${context.jobTitle}</strong> at <strong>${context.companyName}</strong>!</p>
    <p>
      <strong>Position:</strong> ${context.jobTitle}<br/>
      <strong>Company:</strong> ${context.companyName}<br/>
      <strong>Offered Salary:</strong> ${salary}
    </p>
    <p>Please review the offer details and let us know of your decision at your earliest convenience.</p>
    <p>Regards,<br/>${context.companyName}</p>
  `;

  try {
    await sendMail(candidateEmail, subject, html);
  } catch (err) {
    console.error("Failed to send offer extended email", err);
  }
};

/**
 * Send email when job is expiring soon (to recruiter)
 */
export const sendJobExpiringEmail = async (
  recruiterEmail: string,
  recruiterName: string,
  jobTitle: string,
  companyName: string,
  expiresAt: Date,
) => {
  const expiryDate = new Date(expiresAt).toLocaleDateString();
  const subject = `Reminder: Job posting expiring soon — ${jobTitle}`;
  const html = `
    <p>Hi ${recruiterName},</p>
    <p>This is a reminder that your job posting for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> is expiring soon.</p>
    <p>
      <strong>Expiration Date:</strong> ${expiryDate}
    </p>
    <p>Renew your posting to continue receiving applications from qualified candidates.</p>
    <p>Regards,<br/>HireFlow Team</p>
  `;

  try {
    await sendMail(recruiterEmail, subject, html);
  } catch (err) {
    console.error("Failed to send job expiring email", err);
  }
};

export default {
  sendApplicationReceivedEmail,
  sendApplicationStageUpdateEmail,
  sendInterviewScheduledEmail,
  sendOfferExtendedEmail,
  sendJobExpiringEmail,
};

import { prisma } from "@lib/prisma";
import { sendJobExpiringEmail } from "./notification.service";
/**
 * Check for jobs expiring within X days and send notifications to recruiters
 * Should be run as a scheduled task (e.g., cron job)
 * @param daysUntilExpiry Number of days until expiry to check (default: 3)
 */
export const sendJobExpiringNotifications = async (daysUntilExpiry = 3) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000);
    // Find jobs expiring soon that haven't been closed yet
    const expiringJobs = await prisma.job.findMany({
        where: {
            expiresAt: {
                gte: now,
                lte: futureDate,
            },
            status: {
                in: ["PUBLISHED", "PAUSED"],
            },
        },
        include: {
            postedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            company: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    // Send emails to recruiters
    for (const job of expiringJobs) {
        try {
            if (job.postedBy.email) {
                await sendJobExpiringEmail(job.postedBy.email, job.postedBy.name || "Recruiter", job.title, job.company.name, job.expiresAt);
            }
        }
        catch (err) {
            console.error(`Failed to send job expiring email for job ${job.id}`, err);
        }
    }
    return expiringJobs.length;
};
export const jobExpirationService = {
    sendJobExpiringNotifications,
};
//# sourceMappingURL=jobExpiration.service.js.map
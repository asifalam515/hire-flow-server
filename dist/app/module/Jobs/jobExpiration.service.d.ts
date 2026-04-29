/**
 * Check for jobs expiring within X days and send notifications to recruiters
 * Should be run as a scheduled task (e.g., cron job)
 * @param daysUntilExpiry Number of days until expiry to check (default: 3)
 */
export declare const sendJobExpiringNotifications: (daysUntilExpiry?: number) => Promise<number>;
export declare const jobExpirationService: {
    sendJobExpiringNotifications: (daysUntilExpiry?: number) => Promise<number>;
};
//# sourceMappingURL=jobExpiration.service.d.ts.map
import { prisma } from "@/lib/prisma";
export const logAdminAction = (actorId, action, entityType, entityId, metadata) => {
    // Fire-and-forget: do not await in callers
    prisma.adminLog
        .create({
        data: {
            actorId,
            action,
            entityType,
            entityId,
            metadata: metadata ?? null,
        },
    })
        .catch((err) => {
        // Log but don't throw — logging should not block admin actions
        // eslint-disable-next-line no-console
        console.error("Failed to write admin log:", err);
    });
};
export default { logAdminAction };
//# sourceMappingURL=adminLog.js.map
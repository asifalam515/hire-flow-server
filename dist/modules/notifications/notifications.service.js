import { prisma } from "@/lib/prisma";
import { emitToUser } from "@/lib/socket";
export const createNotification = async (userId, type, title, body, data) => {
    const notification = await prisma.notification.create({
        data: {
            userId,
            // Prisma will coerce enum string values
            type: type,
            title,
            body,
            data: data ? data : null,
        },
    });
    // Emit real-time notification to user (all sockets)
    try {
        emitToUser(userId, "notification:new", {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            data: notification.data,
            createdAt: notification.createdAt,
        });
    }
    catch (err) {
        // ignore socket errors
    }
    return notification;
};
export const getNotifications = async (userId, unreadOnly = false, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (unreadOnly)
        where.isRead = false;
    const [data, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.notification.count({ where }),
    ]);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const getUnreadCount = async (userId) => {
    return prisma.notification.count({ where: { userId, isRead: false } });
};
export const markAsRead = async (notificationId, userId) => {
    const updated = await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: new Date() },
    });
    return updated.count > 0;
};
export const markAllAsRead = async (userId) => {
    const res = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
    });
    // Notify other open clients to sync
    try {
        emitToUser(userId, "notification:read_all", {});
    }
    catch (err) {
        // ignore
    }
    return res.count;
};
export const deleteNotification = async (notificationId, userId) => {
    const deleted = await prisma.notification.deleteMany({
        where: { id: notificationId, userId },
    });
    return deleted.count > 0;
};
export const deleteAllNotifications = async (userId) => {
    const res = await prisma.notification.deleteMany({ where: { userId } });
    return res.count;
};
export default {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
};
//# sourceMappingURL=notifications.service.js.map
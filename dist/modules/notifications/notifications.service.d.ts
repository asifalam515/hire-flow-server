import type { NotificationType } from "@/generated/prisma/enums";
export declare const createNotification: (userId: string, type: NotificationType | string, title: string, body: string, data?: any) => Promise<any>;
export declare const getNotifications: (userId: string, unreadOnly?: boolean | undefined, page?: number, limit?: number) => Promise<{
    data: any;
    pagination: {
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getUnreadCount: (userId: string) => Promise<any>;
export declare const markAsRead: (notificationId: string, userId: string) => Promise<boolean>;
export declare const markAllAsRead: (userId: string) => Promise<any>;
export declare const deleteNotification: (notificationId: string, userId: string) => Promise<boolean>;
export declare const deleteAllNotifications: (userId: string) => Promise<any>;
declare const _default: {
    createNotification: (userId: string, type: NotificationType | string, title: string, body: string, data?: any) => Promise<any>;
    getNotifications: (userId: string, unreadOnly?: boolean | undefined, page?: number, limit?: number) => Promise<{
        data: any;
        pagination: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount: (userId: string) => Promise<any>;
    markAsRead: (notificationId: string, userId: string) => Promise<boolean>;
    markAllAsRead: (userId: string) => Promise<any>;
    deleteNotification: (notificationId: string, userId: string) => Promise<boolean>;
    deleteAllNotifications: (userId: string) => Promise<any>;
};
export default _default;
//# sourceMappingURL=notifications.service.d.ts.map
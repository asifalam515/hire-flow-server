import { Prisma, Notification, NotificationType } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const createNotificationRecord = async (data: Prisma.NotificationUncheckedCreateInput): Promise<Notification> => {
  return prisma.notification.create({ data });
};

export const createManyNotificationRecords = async (data: Prisma.NotificationUncheckedCreateInput[]): Promise<Prisma.BatchPayload> => {
  return prisma.notification.createMany({ data });
};

export const getUserNotificationsRecord = async (userId: string, filterType?: NotificationType): Promise<Notification[]> => {
  const where: Prisma.NotificationWhereInput = { userId };
  if (filterType) {
    where.type = filterType;
  }

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50 // limit to recent 50 for performance
  });
};

export const markNotificationAsReadRecord = async (id: string, userId: string): Promise<Notification> => {
  // Use updateMany to ensure we only update if it belongs to the user
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });
  
  return prisma.notification.findUniqueOrThrow({ where: { id } });
};

export const getUnreadNotificationCountRecord = async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false }
  });
};

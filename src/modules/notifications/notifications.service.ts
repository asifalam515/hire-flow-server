import { NotificationType } from '@prisma/client';
import * as repo from './notifications.repository';

export const getUserNotifications = async (userId: string, filterType?: string) => {
  let typeParam: NotificationType | undefined;
  if (filterType && Object.values(NotificationType).includes(filterType as NotificationType)) {
    typeParam = filterType as NotificationType;
  }
  return repo.getUserNotificationsRecord(userId, typeParam);
};

export const markAsRead = async (id: string, userId: string) => {
  return repo.markNotificationAsReadRecord(id, userId);
};

export const getUnreadCount = async (userId: string) => {
  return repo.getUnreadNotificationCountRecord(userId);
};

// Internal helpers for triggering notifications
export const triggerApplicationUpdateNotification = async (userId: string, companyName: string, roleTitle: string, status: string, actionUrl: string) => {
  const messageMap: Record<string, string> = {
    SCREENING: `Your resume has been successfully submitted for the '${roleTitle}' position at ${companyName}. We'll keep you updated on the next steps.`,
    INTERVIEW: `Congratulations! ${companyName} has invited you to interview for the '${roleTitle}' position.`,
    OFFER: `Great news! ${companyName} has extended an offer for the '${roleTitle}' position.`,
    REJECTED: `Thank you for applying to ${companyName}. Unfortunately, they have decided to move forward with other candidates for the '${roleTitle}' position.`
  };
  
  const content = messageMap[status] || `Your application for '${roleTitle}' at ${companyName} has been updated.`;
  
  await repo.createNotificationRecord({
    userId,
    type: NotificationType.APPLICATION_UPDATE,
    title: 'Application Update',
    content,
    actionUrl
  });
};

export const triggerNewJobNotification = async (userIds: string[], companyName: string, roleTitle: string, actionUrl: string) => {
  const content = `Exciting opportunity! A '${roleTitle}' role has just been posted at ${companyName}. Check your dashboard for more information and apply now.`;
  
  const records = userIds.map(userId => ({
    userId,
    type: NotificationType.NEW_JOB,
    title: 'New Job Alert',
    content,
    actionUrl
  }));

  if (records.length > 0) {
    await repo.createManyNotificationRecords(records);
  }
};

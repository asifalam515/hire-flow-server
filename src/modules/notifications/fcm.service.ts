import { MulticastMessage } from 'firebase-admin/messaging';
import { messaging, isFirebaseInitialized } from '../../config/firebase';
import { findUserFcmTokensRecord, updateUserFcmTokensRecord } from './notifications.repository';

/**
 * Send a push notification to a specific user across all their registered devices.
 * 
 * @param userId The ID of the user to notify
 * @param title The title of the notification (e.g., 'New Message from Google')
 * @param body The body text of the notification
 * @param data Optional payload data (e.g., { url: '/employer/dashboard/messages' })
 */
export const sendPushNotificationToUser = async (
  userId: string, 
  title: string, 
  body: string, 
  data?: Record<string, string>
) => {
  if (!isFirebaseInitialized || !messaging) {
    console.log(`[FCM Mock] Push notification intended for ${userId}: ${title} - ${body}`);
    return;
  }

  try {
    const fcmTokens = await findUserFcmTokensRecord(userId);

    if (fcmTokens.length === 0) {
      // User has no registered devices for notifications
      return;
    }

    const message: MulticastMessage = {
      notification: {
        title,
        body
      },
      tokens: fcmTokens,
      ...(data && { data }),
    };

    const response = await messaging.sendEachForMulticast(message);
    
    // Optional: Clean up stale/invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp: { success: boolean }, idx: number) => {
        const token = fcmTokens[idx];
        if (!resp.success && token) {
          failedTokens.push(token);
        }
      });
      
      if (failedTokens.length > 0) {
        await updateUserFcmTokensRecord(
          userId,
          fcmTokens.filter((t: string) => !failedTokens.includes(t))
        );
      }
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};

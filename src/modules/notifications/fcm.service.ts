import { admin, isFirebaseInitialized } from '../../config/firebase';
import { prisma } from '../../config/prisma';

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
  if (!isFirebaseInitialized) {
    console.log(`[FCM Mock] Push notification intended for ${userId}: ${title} - ${body}`);
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true }
    });

    if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
      // User has no registered devices for notifications
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      data,
      tokens: user.fcmTokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Optional: Clean up stale/invalid tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(user.fcmTokens[idx]);
        }
      });
      
      if (failedTokens.length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            fcmTokens: {
              set: user.fcmTokens.filter(t => !failedTokens.includes(t))
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};

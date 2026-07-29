import { Request, Response } from 'express';
import * as service from './notifications.service';

export const getUserNotificationsController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { filterType } = req.query;
  const notifications = await service.getUserNotifications(userId, filterType as string);
  
  res.status(200).json({
    success: true,
    data: notifications
  });
};

export const getUnreadCountController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const count = await service.getUnreadCount(userId);
  
  res.status(200).json({
    success: true,
    data: { count }
  });
};

export const markAsReadController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  
  const notification = await service.markAsRead(id, userId);
  
  res.status(200).json({
    success: true,
    data: notification
  });
};

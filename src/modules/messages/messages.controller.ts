import { Request, Response } from 'express';
import * as messageService from './messages.service';
import { AppError } from '../../utils/AppError';
import { io } from '../../websockets/socket';
import { sendPushNotificationToUser } from '../notifications/fcm.service';
import { prisma } from '../../config/prisma';

export const getConversations = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const conversations = await messageService.getUserConversations(userId);
  res.status(200).json({ success: true, data: conversations });
};

export const getMessages = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const id = req.params.id as string;
  const messages = await messageService.getConversationMessages(userId, id);
  res.status(200).json({ success: true, data: messages });
};

export const startConversation = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  // Typically a company/recruiter initiates with a candidate or vice versa
  // Expect targetUserId (the other person)
  const { targetUserId, companyId } = req.body;
  if (!targetUserId) throw new AppError('targetUserId is required', 400);

  const role = req.user?.role;
  let candidateId = '';
  let recruiterId = '';

  if (role === 'CANDIDATE') {
    candidateId = userId;
    recruiterId = targetUserId;
  } else {
    candidateId = targetUserId;
    recruiterId = userId;
  }

  const conversation = await messageService.findOrCreateConversation(candidateId, recruiterId, companyId);
  res.status(201).json({ success: true, data: conversation });
};

export const sendMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const id = req.params.id as string;
  const message = await messageService.sendMessage(userId, {
    conversationId: id,
    ...req.body
  });

  // Emit the message in real-time to everyone in the room
  io.to(id).emit('receive_message', message);

  // Send Firebase Push Notification to the offline user
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { candidateId: true, recruiterId: true }
    });

    if (conversation) {
      const targetUserId = conversation.candidateId === userId ? conversation.recruiterId : conversation.candidateId;
      await sendPushNotificationToUser(
        targetUserId,
        'New Message',
        message.type === 'TEXT' ? (message.content || 'Sent a message') : 'Sent an attachment',
        { type: 'chat', conversationId: id }
      );
    }
  } catch (err) {
    console.error('Failed to send FCM push for new message', err);
  }

  res.status(201).json({ success: true, data: message });
};

export const markAsRead = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const id = req.params.id as string;
  const result = await messageService.markAsRead(userId, id);

  res.status(200).json({ success: true, data: result });
};

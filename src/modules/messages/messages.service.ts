import * as messageRepo from './messages.repository';
import { AppError } from '../../utils/AppError';
import { MessageType } from '@prisma/client';

export const getUserConversations = async (userId: string) => {
  return messageRepo.getConversationsByUserId(userId);
};

export const getConversationMessages = async (userId: string, conversationId: string) => {
  const conversation = await messageRepo.getConversationById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  return messageRepo.getMessagesByConversationId(conversationId);
};

export const findOrCreateConversation = async (candidateId: string, recruiterId: string, companyId?: string) => {
  let conversation = await messageRepo.getConversationByParticipants(candidateId, recruiterId);
  if (!conversation) {
    conversation = await messageRepo.createConversation(candidateId, recruiterId, companyId);
  }
  return conversation;
};

export const sendMessage = async (userId: string, data: {
  conversationId: string;
  type?: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
}) => {
  const conversation = await messageRepo.getConversationById(data.conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  return messageRepo.createMessage({
    ...data,
    senderId: userId
  });
};

export const markAsRead = async (userId: string, conversationId: string) => {
  const conversation = await messageRepo.getConversationById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  await messageRepo.markMessagesAsRead(conversationId, userId);
  return { success: true };
};

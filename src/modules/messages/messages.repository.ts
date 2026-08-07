import { prisma } from '../../config/prisma';
import { MessageType } from '@prisma/client';
import { encryptMessage, decryptMessage } from '../../utils/crypto';

export const getConversationsByUserId = async (userId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { candidateId: userId },
        { recruiterId: userId }
      ]
    },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true
        }
      },
      recruiter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true
        }
      },
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true
        }
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      },
      _count: {
        select: {
          messages: {
            where: {
              isRead: false,
              senderId: {
                not: userId
              }
            }
          }
        }
      }
    },
    orderBy: {
      lastMessageAt: 'desc'
    }
  });

  return conversations.map(conv => ({
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      content: decryptMessage(msg.content)
    }))
  }));
};

export const getMessagesByConversationId = async (conversationId: string) => {
  // Optionally, we could verify that the user is part of the conversation here, 
  // but we can also do it in the service layer.
  const messages = await prisma.message.findMany({
    where: {
      conversationId
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return messages.map(msg => ({
    ...msg,
    content: decryptMessage(msg.content)
  }));
};

export const getConversationById = async (conversationId: string) => {
  return prisma.conversation.findUnique({
    where: { id: conversationId }
  });
};

export const getConversationByParticipants = async (candidateId: string, recruiterId: string) => {
  return prisma.conversation.findUnique({
    where: {
      candidateId_recruiterId: {
        candidateId,
        recruiterId
      }
    }
  });
};

export const createConversation = async (candidateId: string, recruiterId: string, companyId?: string) => {
  return prisma.conversation.create({
    data: {
      candidateId,
      recruiterId,
      ...(companyId && { companyId })
    }
  });
};

export const createMessage = async (data: {
  conversationId: string;
  senderId: string;
  type?: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // Encrypt the content before saving to DB
    const encryptedContent = encryptMessage(data.content);

    const message = await tx.message.create({
      data: {
        ...data,
        content: encryptedContent,
        type: data.type || MessageType.TEXT
      }
    });

    await tx.conversation.update({
      where: { id: data.conversationId },
      data: { lastMessageAt: message.createdAt }
    });

    // Decrypt it before returning so the real-time socket emit gets the plaintext
    return {
      ...message,
      content: decryptMessage(message.content)
    };
  });
};

export const markMessagesAsRead = async (conversationId: string, receiverId: string) => {
  return prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: receiverId },
      isRead: false
    },
    data: {
      isRead: true
    }
  });
};

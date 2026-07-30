import { z } from 'zod';
import { MessageType } from '@prisma/client';

export const startConversationSchema = z.object({
  body: z.object({
    targetUserId: z.string({
      message: 'targetUserId is required',
    }),
    companyId: z.string().optional(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    type: z.nativeEnum(MessageType).optional(),
    content: z.string().optional(),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    fileSize: z.string().optional(),
    audioDuration: z.string().optional(),
  }).refine((data) => data.content || data.fileUrl, {
    message: 'Either content or fileUrl must be provided',
    path: ['content'],
  }),
});

export const conversationParamSchema = z.object({
  params: z.object({
    id: z.string({
      message: 'Conversation ID is required',
    }),
  }),
});

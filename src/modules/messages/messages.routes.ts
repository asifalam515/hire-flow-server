import { Router } from 'express';
import * as messageController from './messages.controller';
import { requireAuth as protect } from '../../middlewares/auth.middleware';
import { validateRequest as validate } from '../../middlewares/validateRequest';
import {
  startConversationSchema,
  sendMessageSchema,
  conversationParamSchema
} from './messages.validation';

const router = Router();

router.use(protect);

router.get('/conversations', messageController.getConversations);

router.post(
  '/conversations',
  validate(startConversationSchema),
  messageController.startConversation
);

router.get(
  '/conversations/:id/messages',
  validate(conversationParamSchema),
  messageController.getMessages
);

router.post(
  '/conversations/:id/messages',
  validate(conversationParamSchema),
  validate(sendMessageSchema),
  messageController.sendMessage
);

router.put(
  '/conversations/:id/read',
  validate(conversationParamSchema),
  messageController.markAsRead
);

export const messageRoutes = router;

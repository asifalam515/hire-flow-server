import { Router } from 'express';
import { 
  getUserNotificationsController, 
  markAsReadController,
  getUnreadCountController
} from './notifications.controller';
import { catchAsync } from '../../utils/catchAsync';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', catchAsync(getUserNotificationsController));
router.get('/unread-count', catchAsync(getUnreadCountController));
router.patch('/:id/read', catchAsync(markAsReadController));

export const notificationsRoutes = router;

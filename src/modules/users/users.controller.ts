import { Request, Response } from 'express';
import { registerUser, loginUser, updateUserAvatar, updateEmployerProfile, updateEmail, updatePassword, updateNotifications, deleteUser } from './users.service';
import { env } from '../../config/env';

// ---------------------------------------------------------------------------
// Users Controller (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Attach the Refresh Token to an HttpOnly, Secure, SameSite=Strict cookie.
 */
const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * POST /register
 */
export const registerController = async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

/**
 * POST /login
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

/**
 * PATCH /me/avatar
 */
export const updateAvatarController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { avatarUrl } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const result = await updateUserAvatar(userId, avatarUrl);

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully',
    data: result,
  });
};

/**
 * PATCH /me/employer-profile
 */
export const updateEmployerProfileController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const result = await updateEmployerProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Employer profile updated successfully',
    data: {
      user: result,
    },
  });
};

/**
 * PATCH /me/email
 */
export const updateEmailController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await updateEmail(userId, req.body);
  res.status(200).json({
    success: true,
    message: 'Email updated successfully',
    data: { user: result },
  });
};

/**
 * PATCH /me/password
 */
export const updatePasswordController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await updatePassword(userId, req.body);
  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    data: { user: result },
  });
};

/**
 * PATCH /me/notifications
 */
export const updateNotificationsController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await updateNotifications(userId, req.body);
  res.status(200).json({
    success: true,
    message: 'Notification preferences updated',
    data: { user: result },
  });
};

/**
 * DELETE /me
 */
export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  await import('./users.service').then(s => s.deleteUser(userId));

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

export const addFcmTokenController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { token } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  if (!token) {
    res.status(400).json({ success: false, message: 'FCM token is required' });
    return;
  }

  const result = await import('./users.service').then(s => s.addFcmToken(userId, token));

  res.status(200).json({
    success: true,
    message: 'FCM token added successfully',
    data: result,
  });
};

export const removeFcmTokenController = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { token } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  if (!token) {
    res.status(400).json({ success: false, message: 'FCM token is required' });
    return;
  }

  const result = await import('./users.service').then(s => s.removeFcmToken(userId, token));

  res.status(200).json({
    success: true,
    message: 'FCM token removed successfully',
    data: result,
  });
};

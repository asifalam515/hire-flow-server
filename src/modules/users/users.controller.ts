import { Request, Response } from 'express';
import { registerUser, loginUser, updateUserAvatar, updateEmployerProfile } from './users.service';
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

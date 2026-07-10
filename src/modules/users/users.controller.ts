import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { env } from '../../config/env';

// ---------------------------------------------------------------------------
// Users Controller
// ---------------------------------------------------------------------------
// Handles incoming HTTP requests, invokes the UsersService, sets cookies,
// and formats standard JSON responses.
// ---------------------------------------------------------------------------

export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService = new UsersService()) {
    this.usersService = usersService;
  }

  /**
   * POST /register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.usersService.register(req.body);

    this.setRefreshTokenCookie(res, result.refreshToken);

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
  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.usersService.login(req.body);

    this.setRefreshTokenCookie(res, result.refreshToken);

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
   * Attach the Refresh Token to an HttpOnly, Secure, SameSite=Strict cookie.
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  }
}

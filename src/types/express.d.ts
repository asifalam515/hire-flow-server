//declare global for express types
declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

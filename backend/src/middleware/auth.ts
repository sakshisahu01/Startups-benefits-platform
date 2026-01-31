import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendError } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string; isVerified: boolean };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId).select('email name isVerified');
    if (!user) {
      sendError(res, 'UNAUTHORIZED', 'User not found', 401);
      return;
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
    next();
  } catch {
    sendError(res, 'UNAUTHORIZED', 'Invalid or expired token', 401);
  }
}

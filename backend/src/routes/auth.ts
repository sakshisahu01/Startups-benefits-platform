import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendError } from '../utils/errors.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    sendError(res, 'VALIDATION_ERROR', 'Email, password, and name are required', 400);
    return;
  }
  if (typeof password !== 'string' || password.length < 6) {
    sendError(res, 'VALIDATION_ERROR', 'Password must be at least 6 characters', 400);
    return;
  }
  const existing = await User.findOne({ email: (email as string).toLowerCase().trim() });
  if (existing) {
    sendError(res, 'CONFLICT', 'Email already registered', 409);
    return;
  }
  const user = await User.create({
    email: (email as string).toLowerCase().trim(),
    password: password as string,
    name: (name as string).trim(),
  });
  const token = signToken(user._id.toString());
  res.status(201).json({
    user: { id: user._id, email: user.email, name: user.name, isVerified: user.isVerified },
    token,
  });
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, 'VALIDATION_ERROR', 'Email and password are required', 400);
    return;
  }
  const user = await User.findOne({ email: (email as string).toLowerCase().trim() }).select('+password');
  if (!user) {
    sendError(res, 'UNAUTHORIZED', 'Invalid email or password', 401);
    return;
  }
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    sendError(res, 'UNAUTHORIZED', 'Invalid email or password', 401);
    return;
  }
  const token = signToken(user._id.toString());
  res.json({
    user: { id: user._id, email: user.email, name: user.name, isVerified: user.isVerified },
    token,
  });
});

router.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  res.json({ user: req.user });
});

export default router;

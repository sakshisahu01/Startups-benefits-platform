import { Response } from 'express';

export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export interface AppErrorBody {
  error: { code: AppErrorCode; message: string };
}

export function sendError(
  res: Response,
  code: AppErrorCode,
  message: string,
  status: number = 400
): void {
  res.status(status).json({ error: { code, message } });
}

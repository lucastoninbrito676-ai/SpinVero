import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Autenticação necessária.' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN', message: 'Token inválido ou expirado.' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ error: 'FORBIDDEN', message: 'Você não possui permissão para esta ação.' });
      return;
    }
    next();
  };
}

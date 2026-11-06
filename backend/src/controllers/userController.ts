import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getPublicUser(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, avatarUrl: true, role: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    return;
  }
  res.json({ user });
}

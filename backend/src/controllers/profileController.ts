import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const profileSchema = z.object({
  level: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO', 'PROFISSIONAL']).optional(),
  style: z.enum(['OFENSIVO', 'DEFENSIVO', 'ALL_ROUND', 'COUNTER_BLOCK', 'TOPSPIN', 'CONTROLE']).optional(),
  hand: z.enum(['DIREITA', 'ESQUERDA']).optional(),
  priority: z.enum(['VELOCIDADE', 'CONTROLE', 'SPIN', 'EQUILIBRIO']).optional(),
  budget: z.number().finite().nonnegative().optional(),
  strength: z.string().trim().max(120).optional(),
  problem: z.string().trim().max(120).optional(),
  goal: z.string().trim().max(240).optional(),
});

export async function getProfile(req: Request, res: Response) {
  const profile = await prisma.profile.findUnique({ where: { userId: req.auth!.userId } });
  res.json({ profile });
}

export async function updateProfile(req: Request, res: Response) {
  const input = profileSchema.parse(req.body);
  const profile = await prisma.profile.upsert({
    where: { userId: req.auth!.userId },
    create: { userId: req.auth!.userId, ...input },
    update: input,
  });
  res.json({ profile });
}

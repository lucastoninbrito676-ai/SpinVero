import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createAccessToken, createRefreshToken, hashRefreshToken } from '../utils/tokens.js';

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(100),
});


const userPatchSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  avatarUrl: z.string().url().max(1000).nullable().optional(),
}).refine((value) => value.name !== undefined || value.avatarUrl !== undefined, {
  message: 'Nenhuma alteração informada.',
});

function publicUser(user: { id: string; name: string; email: string; avatarUrl: string | null; role: string }) {
  return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role };
}

async function issueSession(userId: string, role: string, res: Response) {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_DAYS * 86_400_000);

  await prisma.authSession.create({
    data: { userId, refreshTokenHash: hashRefreshToken(refreshToken), expiresAt },
  });

  res.cookie('spinvero_refresh', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/api/auth',
  });

  return createAccessToken(userId, role);
}

export async function register(req: Request, res: Response) {
  const input = credentialsSchema.extend({ name: z.string().trim().min(2).max(80) }).parse(req.body);
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    res.status(409).json({ error: 'EMAIL_IN_USE', message: 'Este e-mail já está cadastrado.' });
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash: await hashPassword(input.password),
      profile: { create: {} },
    },
  });

  const accessToken = await issueSession(user.id, user.role, res);
  res.status(201).json({ user: publicUser(user), accessToken });
}

export async function login(req: Request, res: Response) {
  const input = credentialsSchema.omit({ name: true }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos.' });
    return;
  }

  const accessToken = await issueSession(user.id, user.role, res);
  res.json({ user: publicUser(user), accessToken });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, include: { profile: true } });
  if (!user) {
    res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' });
    return;
  }
  res.json({ user: publicUser(user), profile: user.profile });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies.spinvero_refresh as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'REFRESH_REQUIRED', message: 'Sessão expirada.' });
    return;
  }

  const session = await prisma.authSession.findUnique({
    where: { refreshTokenHash: hashRefreshToken(token) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    res.clearCookie('spinvero_refresh', { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', path: '/api/auth' });
    res.status(401).json({ error: 'REFRESH_INVALID', message: 'Sessão expirada.' });
    return;
  }

  await prisma.authSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
  const accessToken = await issueSession(session.userId, session.user.role, res);
  res.json({ accessToken });
}

export async function updateMe(req: Request, res: Response) {
  const input = userPatchSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: input,
  });
  res.json({ user: publicUser(user) });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies.spinvero_refresh as string | undefined;
  if (token) {
    await prisma.authSession.updateMany({
      where: { refreshTokenHash: hashRefreshToken(token), userId: req.auth!.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  res.clearCookie('spinvero_refresh', { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', path: '/api/auth' });
  res.status(204).send();
}

import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function listProducts(req: Request, res: Response) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 100);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const skip = (page - 1) * limit;

  const where = {
    ...(category ? { category: category as never } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { description: { contains: search, mode: 'insensitive' as const } }, { brand: { name: { contains: search, mode: 'insensitive' as const } } }] } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, images: { orderBy: { sortOrder: 'asc' } }, bladeSpecs: true, rubberSpecs: true, racketSpecs: true, accessorySpecs: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { brand: true, images: { orderBy: { sortOrder: 'asc' } }, tags: { include: { tag: true } }, bladeSpecs: true, rubberSpecs: true, racketSpecs: true, accessorySpecs: true, reviews: { include: { user: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' }, take: 20 } },
  });

  if (!product) {
    res.status(404).json({ error: 'PRODUCT_NOT_FOUND', message: 'Equipamento não encontrado.' });
    return;
  }
  res.json(product);
}

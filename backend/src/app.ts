import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'spinvero-api', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Rota não encontrada.' });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.name === 'ZodError') {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Dados inválidos.' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' });
});

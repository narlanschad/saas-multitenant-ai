import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './modules/auth/routes.js';
import { chatRouter } from './modules/chat/routes.js';
import { productsRouter } from './modules/products/routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/auth', authRouter);
  app.use('/products', productsRouter);
  app.use('/chat', chatRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  app.use(errorHandler);

  return app;
}

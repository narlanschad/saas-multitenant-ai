import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

interface MongoServerError extends Error {
  code?: number;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(404).json({ error: 'Recurso não encontrado' });
    return;
  }

  const mongoError = err as MongoServerError;
  if (mongoError.code === 11000) {
    res.status(409).json({ error: 'Este recurso já existe' });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({ error: 'Erro interno do servidor' });
}

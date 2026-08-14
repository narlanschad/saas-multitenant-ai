import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { getTenantId } from '../../lib/tenantContext.js';
import * as chatService from './service.js';

export const sendMessageHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  const reply = await chatService.sendMessage(companyId, req.body.message);
  res.status(200).json({ reply });
});

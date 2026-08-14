import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validate } from '../../middlewares/validate.js';
import { sendMessageHandler } from './controller.js';
import { chatMessageSchema } from './schemas.js';

export const chatRouter = Router();

chatRouter.post('/', authenticate, validate({ body: chatMessageSchema }), sendMessageHandler);

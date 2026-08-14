import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { loginHandler, registerHandler } from './controller.js';
import { loginSchema, registerSchema } from './schemas.js';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), registerHandler);
authRouter.post('/login', validate({ body: loginSchema }), loginHandler);

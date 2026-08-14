import OpenAI from 'openai';
import { env } from '../config/env.js';

// OpenRouter exposes an OpenAI-compatible Chat Completions API, so the
// official OpenAI SDK works unmodified — only the base URL and key differ.
export const openrouter = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

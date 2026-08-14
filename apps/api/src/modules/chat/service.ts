import { runChatAgent } from '../../ai/chatAgent.js';

export function sendMessage(companyId: string, message: string) {
  return runChatAgent(message, { companyId });
}

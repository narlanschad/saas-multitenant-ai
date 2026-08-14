import { apiClient } from './client';

export async function sendChatMessage(message: string): Promise<string> {
  const { data } = await apiClient.post<{ reply: string }>('/chat', { message });
  return data.reply;
}

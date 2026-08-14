import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { extractErrorMessage } from '../../components/ErrorState';
import { Input } from '../../components/Input';
import { sendChatMessage } from '../../api/chat';
import { ChatMessageBubble } from './ChatMessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({ mutationFn: sendChatMessage });

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || mutation.isPending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const reply = await mutation.mutateAsync(trimmed);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: extractErrorMessage(err, 'Não foi possível falar com o assistente. Tente novamente.'),
          isError: true,
        },
      ]);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Pergunte sobre seus produtos
      </h1>
      <p className="mb-4 text-xs text-amber-700 dark:text-amber-500">
        Este assistente usa um modelo de IA gratuito e pode demorar para responder (até alguns
        minutos) em horários de pico.
      </p>

      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {messages.length === 0 ? (
          <EmptyState
            title="Nenhuma mensagem ainda"
            description='Pergunte algo como "Quais produtos custam menos de R$ 50?"'
          />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                isError={message.isError}
              />
            ))}
            {mutation.isPending && <TypingIndicator />}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <div className="flex-1">
          <Input
            label="Mensagem"
            hideLabel
            placeholder="Pergunte sobre produtos, preços, categorias…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending || !input.trim()} className="self-start">
          Enviar
        </Button>
      </form>
    </div>
  );
}

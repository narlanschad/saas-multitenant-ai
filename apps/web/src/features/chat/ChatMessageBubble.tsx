import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
  a: ({ children, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export function ChatMessageBubble({ role, content, isError }: ChatMessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="ml-auto max-w-[80%] rounded-lg bg-slate-900 px-4 py-2 text-sm whitespace-pre-wrap text-white dark:bg-slate-100 dark:text-slate-900">
        {content}
      </div>
    );
  }

  return (
    <div
      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
        isError
          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
      }`}
    >
      <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-table:my-2 dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

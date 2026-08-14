export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Assistente está digitando"
      className="flex w-fit items-center gap-1 rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-800"
    >
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s] dark:bg-slate-500" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s] dark:bg-slate-500" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
    </div>
  );
}

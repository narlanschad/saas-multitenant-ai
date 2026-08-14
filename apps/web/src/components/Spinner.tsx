export function Spinner({ label = 'Carregando' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-8 text-slate-500 dark:text-slate-400">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

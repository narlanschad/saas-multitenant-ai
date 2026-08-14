import { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

export function Input({ label, error, hideLabel = false, id, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className={`text-sm font-medium text-slate-700 dark:text-slate-300 ${hideLabel ? 'sr-only' : ''}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-md border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-100 ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ErrorState, extractErrorMessage } from '../../components/ErrorState';
import { Input } from '../../components/Input';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useAuth } from '../../auth/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/products');
    } catch (err) {
      setError(extractErrorMessage(err, 'Email ou senha inválidos.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm p-8">
        <img src="/rigatti.webp" alt="Rigatti" className="mb-6 h-7 w-auto" />
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Entrar</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Acesse o painel da sua empresa
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorState message={error} />}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-slate-900 underline dark:text-slate-100">
            Cadastre sua empresa
          </Link>
        </p>
      </Card>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ErrorState, extractErrorMessage } from '../../components/ErrorState';
import { Input } from '../../components/Input';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useAuth } from '../../auth/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ companyName, name, email, password });
      navigate('/products');
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível criar sua conta.'));
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
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
          Cadastre sua empresa
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Você será o primeiro administrador
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Nome da empresa"
            required
            minLength={2}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            label="Seu nome"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorState message={error} />}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-slate-900 underline dark:text-slate-100">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../auth/useAuth';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
  }`;

const ROLE_LABELS: Record<'admin' | 'user', string> = {
  admin: 'administrador',
  user: 'usuário',
};

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <div className="hidden items-center gap-3 sm:flex">
              <img src="/rigatti.webp" alt="Rigatti" className="h-6 w-auto" />
              <span className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <span className="max-w-[10rem] truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                {user?.companyName}
              </span>
            </div>
            <img src="/rigatti.webp" alt="Rigatti" className="h-6 w-auto sm:hidden" />
            <nav className="flex gap-1">
              <NavLink to="/products" className={navLinkClasses}>
                Produtos
              </NavLink>
              <NavLink to="/chat" className={navLinkClasses}>
                Chat
              </NavLink>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-slate-500 md:inline dark:text-slate-400">
              {user?.name} · {user && ROLE_LABELS[user.role]}
            </span>
            <ThemeToggle />
            <Button variant="secondary" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import {
  loginRequest,
  registerRequest,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from '../api/auth';

const STORAGE_KEY = 'saas-multitenant-ai:auth';

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setAuthToken(stored.token);
      return stored.user;
    }
    return null;
  });

  const persist = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
    setAuthToken(token);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const { token, user: loggedInUser } = await loginRequest(input);
      persist(token, loggedInUser);
    },
    [persist],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { token, user: registeredUser } = await registerRequest(input);
      persist(token, registeredUser);
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

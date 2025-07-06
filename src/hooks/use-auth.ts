'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sleepwise_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('sleepwise_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (email: string) => {
      const userData = { email };
      localStorage.setItem('sleepwise_user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    },
    [router]
  );
  
  const register = useCallback(
    (email: string) => {
      const userData = { email };
      localStorage.setItem('sleepwise_user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('sleepwise_user');
    localStorage.removeItem('sleepwise_reports');
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, isLoading, isAuthenticated: !!user, login, register, logout };
}

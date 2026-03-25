import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    // Simulação de chamada à sua JJ Banking API
    setTimeout(() => {
      setUser({ name: 'Jamerson', email: 'jamerson@email.com' });
      setIsLoading(false);
    }, 2000);
  };

  const logout = () => setUser(null);

  return { user, isLoading, login, logout };
}
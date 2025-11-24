import { useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
    }
  };

  return { user, loading, error, logout };
}

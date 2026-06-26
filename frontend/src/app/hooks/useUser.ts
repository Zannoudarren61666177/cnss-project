import { useState, useEffect } from 'react';
import { getUser, getStoredUser } from '../api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'employeur' | 'travailleur' | 'agent' | 'admin';
  statut: string;
  profile?: {
    numero_cnss: string;
    company_name?: string;
    ifu?: string;
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord avec les données stockées
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser as User);
      }
      
      // Puis récupérer depuis l'API pour avoir les données à jour
      const freshUser = await getUser();
      if (freshUser) {
        setUser(freshUser as User);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur';
      setError(message);
      
      // Si l'API échoue, utiliser les données stockées
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser as User);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const onUserUpdated = () => {
      fetchUser();
    };
    window.addEventListener('cnss:user-updated', onUserUpdated);
    return () => window.removeEventListener('cnss:user-updated', onUserUpdated);
  }, []);

  return { user, loading, error, refetch: fetchUser };
}

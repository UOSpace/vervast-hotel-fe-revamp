import { useState, useEffect } from 'react';
import { usersApi } from '../api/users.api';
import type { UserProfile, UserFilter } from '../types/users.types';

export function useUsers(initialFilters?: UserFilter) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (filters?: UserFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.getUsers(filters);
      setUsers(data);
    } catch {
      setError('Failed to fetch users list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(initialFilters);
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}

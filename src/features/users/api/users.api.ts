import { apiClient } from '@/services/api/client';
import type { UserProfile, UserFilter } from '../types/users.types';

const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Alexander Wright',
    email: 'a.wright@vervast.com',
    role: 'Administrator',
    status: 'active',
    department: 'Executive Management',
    lastLogin: '2026-10-08T08:30:00Z',
  },
  {
    id: 'usr-2',
    name: 'Sophia Laurent',
    email: 's.laurent@vervast.com',
    role: 'Manager',
    status: 'active',
    department: 'Guest Experience',
    lastLogin: '2026-10-08T07:15:00Z',
  },
  {
    id: 'usr-3',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@vervast.com',
    role: 'Manager',
    status: 'active',
    department: 'Spa & Wellness',
    lastLogin: '2026-10-07T18:45:00Z',
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'e.rostova@vervast.com',
    role: 'Staff',
    status: 'active',
    department: 'Food & Beverage',
    lastLogin: '2026-10-08T06:00:00Z',
  },
];

export const usersApi = {
  async getUsers(filters?: UserFilter): Promise<UserProfile[]> {
    try {
      const response = await apiClient.get<UserProfile[]>('/users', { params: filters });
      return response.data;
    } catch {
      let filtered = [...MOCK_USERS];
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.department.toLowerCase().includes(query)
        );
      }
      if (filters?.role) {
        filtered = filtered.filter((u) => u.role === filters.role);
      }
      return filtered;
    }
  },

  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<UserProfile>(`/users/${id}`);
      return response.data;
    } catch {
      return MOCK_USERS.find((u) => u.id === id) || null;
    }
  },
};

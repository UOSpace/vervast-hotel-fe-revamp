import React from 'react';
import type { UserProfile } from '../types/users.types';
import { UserCard } from './UserCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Loading } from '@/components/common/Loading';

export interface UserListProps {
  users: UserProfile[];
  isLoading?: boolean;
  onSelectUser?: (user: UserProfile) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onSelectUser,
}) => {
  if (isLoading) {
    return <Loading message="Loading staff directory..." />;
  }

  if (users.length === 0) {
    return <EmptyState title="No Staff Found" description="Try adjusting your search or role filters." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={onSelectUser} />
      ))}
    </div>
  );
};

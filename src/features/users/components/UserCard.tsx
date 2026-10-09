import React from 'react';
import type { UserProfile } from '../types/users.types';

export interface UserCardProps {
  user: UserProfile;
  onClick?: (user: UserProfile) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(user)}
      className="relative rounded-[12px] p-4 flex flex-col justify-between border border-zinc-100 bg-white hover:bg-gray-50/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold uppercase">
          {user.name.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[12px] font-semibold text-zinc-900 truncate">
            {user.name}
          </h4>
          <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-emerald-50 text-emerald-700">
          {user.role}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[9.5px] text-zinc-400">
        <span>{user.department}</span>
        <span className="capitalize">{user.status}</span>
      </div>
    </div>
  );
};

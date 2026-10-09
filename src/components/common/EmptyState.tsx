import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are no records matching your current filter criteria.',
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[12px] border border-dashed border-zinc-200/80 bg-zinc-50/50',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
        {icon || (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="m9 16 3-3 3 3" />
          </svg>
        )}
      </div>
      <h4 className="text-[12px] font-semibold text-zinc-800 leading-tight mb-1">
        {title}
      </h4>
      <p className="text-[10px] text-zinc-500 max-w-xs mb-4 font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

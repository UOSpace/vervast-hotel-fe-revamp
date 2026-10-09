import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[12px] border border-rose-100 bg-rose-50/30',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h4 className="text-[12px] font-semibold text-zinc-900 leading-tight mb-1">
        {title}
      </h4>
      <p className="text-[10px] text-zinc-500 max-w-sm mb-4 font-normal">
        {message}
      </p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

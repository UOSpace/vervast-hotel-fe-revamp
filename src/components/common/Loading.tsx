import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const spinnerSize = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2.5',
  }[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}>
      <div
        className={cn(
          'rounded-full border-zinc-200 border-t-zinc-900 animate-spin',
          spinnerSize
        )}
      />
      {message && (
        <span className="text-[10px] font-medium tracking-wider uppercase text-zinc-500">
          {message}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};

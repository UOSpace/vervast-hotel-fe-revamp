import React from 'react';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`h-8 border-t border-zinc-100 bg-white/50 px-4 flex items-center justify-between text-[9.5px] text-zinc-400 shrink-0 ${className}`}>
      <span>&copy; {new Date().getFullYear()} Vervast Hospitality Systems. All rights reserved.</span>
      <div className="flex items-center gap-3">
        <span>SOSEI Group Architecture v2.4</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span className="text-zinc-500 font-medium">Secured PMS Gateway</span>
      </div>
    </footer>
  );
};

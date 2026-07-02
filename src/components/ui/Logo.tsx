import React from 'react';
import logoImage from '@/assets/logo/image-removebg-preview.png';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img 
      src={logoImage} 
      alt="SOSEI Logo" 
      className={cn("dark:invert", className)} 
      {...props}
    />
  );
}

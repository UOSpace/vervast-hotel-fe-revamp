import React from 'react';
import logoImage from '@/assets/logo/image-removebg-preview.png';

export function Logo({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img 
      src={logoImage} 
      alt="SOSEI Logo" 
      className={className} 
      {...props}
    />
  );
}

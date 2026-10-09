import type { ReactNode } from 'react';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OptionItem<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface ComponentWithChildren {
  children?: ReactNode;
}

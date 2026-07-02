import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircle, 
  CloseCircle, 
  Danger, 
  InfoSquare,
  CloseSquare
} from '@solar-icons/react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message: string;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options.duration ?? 4000;
    
    setToasts((prev) => [...prev, { ...options, id }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message: string, duration?: number) => {
    addToast({ variant: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    addToast({ variant: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    addToast({ variant: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    addToast({ variant: 'info', title, message, duration });
  }, [addToast]);

  const getVariantStyles = (variant: ToastVariant) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-linear-to-r from-[#fafafa] to-[#f4f4f5] border-black/10',
          borderLeft: 'border-l-4 border-l-[#18181b]',
          titleColor: 'text-[#18181b]',
          textColor: 'text-[#3f3f46]',
          iconColor: 'text-[#18181b]',
          icon: <CheckCircle size={22} className="text-[#18181b] shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-linear-to-r from-[#fafafa] to-[#f4f4f5] border-black/10',
          borderLeft: 'border-l-4 border-l-[#18181b]',
          titleColor: 'text-[#18181b]',
          textColor: 'text-[#3f3f46]',
          iconColor: 'text-[#18181b]',
          icon: <CloseCircle size={22} className="text-[#18181b] shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-linear-to-r from-[#fafafa] to-[#f4f4f5] border-black/10',
          borderLeft: 'border-l-4 border-l-[#18181b]',
          titleColor: 'text-[#18181b]',
          textColor: 'text-[#3f3f46]',
          iconColor: 'text-[#18181b]',
          icon: <Danger size={22} className="text-[#18181b] shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-linear-to-r from-[#fafafa] to-[#f4f4f5] border-black/10',
          borderLeft: 'border-l-4 border-l-[#18181b]',
          titleColor: 'text-[#18181b]',
          textColor: 'text-[#3f3f46]',
          iconColor: 'text-[#18181b]',
          icon: <InfoSquare size={22} className="text-[#18181b] shrink-0" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const styles = getVariantStyles(t.variant);
          const iconToRender = t.icon || styles.icon;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex gap-3 p-4 rounded-r-xl rounded-l-md border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${styles.bg} ${styles.borderLeft}`}
              role="alert"
            >
              {iconToRender}
              <div className="flex-1 flex flex-col gap-0.5">
                <h4 className={`text-xs font-bold font-serif ${styles.titleColor}`}>{t.title}</h4>
                <p className={`text-[11px] leading-relaxed ${styles.textColor}`}>{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className={`h-fit p-0.5 rounded-md hover:bg-black/5 transition-colors ${styles.iconColor}`}
              >
                <CloseSquare size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

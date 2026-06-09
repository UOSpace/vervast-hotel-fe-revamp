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
          bg: 'bg-linear-to-r from-[#f0f4ef] to-[#f8faf7] border-[#657454]/30',
          borderLeft: 'border-l-4 border-l-[#657454]',
          titleColor: 'text-[#35432c]',
          textColor: 'text-[#4e5a45]',
          iconColor: 'text-[#657454]',
          icon: <CheckCircle size={22} className="text-[#657454] shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-linear-to-r from-[#faf0ee] to-[#fdfaf9] border-[#a65e52]/30',
          borderLeft: 'border-l-4 border-l-[#a65e52]',
          titleColor: 'text-[#61271f]',
          textColor: 'text-[#7d4138]',
          iconColor: 'text-[#a65e52]',
          icon: <CloseCircle size={22} className="text-[#a65e52] shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-linear-to-r from-[#fcf8ee] to-[#fefcf7] border-[#C8A050]/30',
          borderLeft: 'border-l-4 border-l-[#C8A050]',
          titleColor: 'text-[#5c4618]',
          textColor: 'text-[#7a602a]',
          iconColor: 'text-[#C8A050]',
          icon: <Danger size={22} className="text-[#C8A050] shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-linear-to-r from-[#eff3f6] to-[#f6f9fb] border-[#586981]/30',
          borderLeft: 'border-l-4 border-l-[#586981]',
          titleColor: 'text-[#2b394d]',
          textColor: 'text-[#415169]',
          iconColor: 'text-[#586981]',
          icon: <InfoSquare size={22} className="text-[#586981] shrink-0" />
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

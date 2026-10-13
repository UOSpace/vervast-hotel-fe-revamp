import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DangerTriangle, CloseCircle } from '@solar-icons/react';
import { cn } from '@/lib/utils';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  icon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  isLoading = false,
  children,
  className,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !mounted) return null;

  const defaultIcon =
    variant === 'danger' ? (
      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-[#800020] shrink-0">
        <DangerTriangle size={20} />
      </div>
    ) : variant === 'warning' ? (
      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
        <DangerTriangle size={20} />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0">
        <DangerTriangle size={20} />
      </div>
    );

  const confirmBtnStyles =
    variant === 'danger'
      ? 'bg-zinc-900 hover:bg-black text-white border border-zinc-900 shadow-xs'
      : variant === 'warning'
      ? 'bg-zinc-900 hover:bg-black text-white border border-zinc-900 shadow-xs'
      : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-900 shadow-xs';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-[440px] max-w-[92vw] rounded-[16px] bg-white border border-zinc-200/90 shadow-2xl p-6 z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute right-4 top-4 p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <CloseCircle size={18} />
        </button>

        <div className="flex items-start gap-3.5">
          {icon !== undefined ? icon : defaultIcon}
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-[15px] font-bold text-zinc-900 leading-snug tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-[12px] text-zinc-500 font-normal leading-relaxed mt-1.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Optional Custom Content */}
        {children && <div className="mt-4 pt-3 border-t border-zinc-100 text-xs">{children}</div>}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed',
              confirmBtnStyles
            )}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

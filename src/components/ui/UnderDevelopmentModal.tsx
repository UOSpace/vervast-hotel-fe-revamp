import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseCircle } from '@solar-icons/react';

interface UnderDevelopmentModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

export function UnderDevelopmentModal({ open, onClose, featureName }: UnderDevelopmentModalProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      // Unmount after transition completes
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — renders at document.body level, covers everything including sidebar */}
      <div
        className={`fixed inset-0 bg-black/25 backdrop-blur-sm z-[9998] transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal — centered, above backdrop */}
      <div
        className={`fixed top-1/2 left-1/2 z-[9999] w-[92vw] max-w-[460px] max-h-[85vh] bg-[#fdfaf7] shadow-2xl rounded-2xl border border-[#d4c4b7] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform -translate-x-1/2 ${
          visible
            ? 'opacity-100 scale-100 -translate-y-1/2'
            : 'opacity-0 scale-75 -translate-y-[30%] pointer-events-none'
        }`}
      >
        {/* Header badge */}
        <div className="shrink-0 flex justify-between items-center px-6 py-4 border-b border-[#d4c4b7]/50 bg-gradient-to-b from-[#f3eae1]/60 to-transparent">
          <span className="inline-flex items-center gap-1.5 bg-[#C8A050]/15 border border-[#C8A050]/25 text-[#7a5e2a] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A050] animate-pulse" />
            Coming Soon
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e5d8cb] text-[#6A5848] transition-colors"
          >
            <CloseCircle size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#f3eae1] to-[#efe7d5] border border-[#d4c4b7] flex items-center justify-center mb-1 shadow-inner shrink-0">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C8A050" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C8A050] border-2 border-[#fdfaf7] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-[#4a3c31]">Feature Under Development</h3>
            {featureName && (
              <p className="text-xs text-[#947b66] font-semibold italic">"{featureName}"</p>
            )}
          </div>

          <p className="text-sm text-[#7d6b5e] leading-relaxed max-w-[340px]">
            We're crafting something exceptional here. This feature is being refined to deliver the
            most <strong className="text-[#4a3c31]">intuitive</strong>,{' '}
            <strong className="text-[#4a3c31]">powerful</strong>, and{' '}
            <strong className="text-[#4a3c31]">elegant</strong> experience possible.
          </p>

          {/* Upcoming highlights */}
          <div className="w-full bg-[#f3eae1]/60 border border-[#d4c4b7]/60 rounded-xl px-4 py-3 text-left space-y-2 mt-1">
            {[
              'Real-time analytics with deeper insights',
              'Seamless integration across all modules',
              'A cleaner, more responsive interface',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#4a3c31]">
                <span className="w-4 h-4 rounded-full bg-[#657454]/15 border border-[#657454]/25 flex items-center justify-center shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#657454" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-2 px-7 py-2.5 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] text-sm font-semibold rounded-[10px] transition-all shadow-sm w-full"
          >
            Can't Wait — I'll Stay Tuned!
          </button>

          <p className="text-[10px] text-[#c4b4a7] italic -mt-1">
            This feature will be available in an upcoming update.
          </p>
        </div>
      </div>
    </>,
    document.body
  );
}

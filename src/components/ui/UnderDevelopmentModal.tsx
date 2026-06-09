import { CloseCircle } from '@solar-icons/react';

interface UnderDevelopmentModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

export function UnderDevelopmentModal({ open, onClose, featureName }: UnderDevelopmentModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[60] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[460px] bg-[#fdfaf7] border border-[#d4c4b7] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header badge */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d4c4b7]/50 bg-gradient-to-b from-[#f3eae1]/60 to-transparent">
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
        <div className="px-6 py-8 flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#f3eae1] to-[#efe7d5] border border-[#d4c4b7] flex items-center justify-center mb-1 shadow-inner">
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
    </>
  );
}

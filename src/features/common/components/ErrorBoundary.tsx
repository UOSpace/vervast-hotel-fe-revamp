import { Component, type ReactNode } from 'react';
import { Refresh, Home, CloseCircle } from '@solar-icons/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `FATAL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in bg-[#fdfaf7]">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, #4a3c31 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-[#E3CCB2]/40 flex items-center justify-center border-4 border-[#a65e52]/40 shadow-[0_0_50px_rgba(166,94,82,0.15)]">
              <CloseCircle size={56} className="text-[#a65e52]" />
            </div>
          </div>

          {/* Main message */}
          <h1 className="text-3xl font-serif text-[#4a3c31] mb-3">Something Went Wrong</h1>
          <p className="text-[#7d6b5e] max-w-md mx-auto text-sm leading-relaxed mb-6 text-center">
            An unexpected error occurred while rendering this page. Our team has been notified.
          </p>

          {/* Error summary */}
          <div className="max-w-lg w-full border border-[#a65e52]/30 rounded-xl p-4 bg-[#a65e52]/5 mb-6">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#a65e52] mb-2">Error Details</h3>
            <p className="text-xs text-[#4a3c31] font-mono bg-[#a65e52]/5 p-2 rounded border border-[#a65e52]/20 mb-3">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <div className="space-y-1.5 text-[10px] text-[#6A5848]">
              <div className="flex justify-between py-1 border-b border-[#d4c4b7]/30">
                <span className="text-[#9B8272]">Error ID</span>
                <span className="font-mono text-[#a65e52] font-semibold">{this.state.errorId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#d4c4b7]/30">
                <span className="text-[#9B8272]">Status</span>
                <span>Runtime Error</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#9B8272]">Timestamp</span>
                <span className="font-mono">{new Date().toISOString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a3c31] text-white text-xs font-semibold hover:bg-[#3a2c21] transition-colors shadow-md cursor-pointer"
            >
              <Home size={14} />
              Back to Dashboard
            </button>
            <button
              onClick={this.handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4c4b7] text-[#4a3c31] text-xs font-semibold hover:bg-[#f3eae1]/50 transition-colors cursor-pointer"
            >
              <Refresh size={14} />
              Retry
            </button>
          </div>

          {/* Stack trace (collapsible for devs) */}
          <details className="max-w-lg w-full border border-[#d4c4b7]/60 rounded-xl overflow-hidden">
            <summary className="p-3 bg-[#f3eae1]/30 text-[10px] text-[#7d6b5e] font-semibold cursor-pointer hover:bg-[#f3eae1]/50 transition-colors">
              Stack Trace (for developers)
            </summary>
            <pre className="p-4 text-[9px] text-[#6A5848] font-mono bg-[#f3eae1]/10 overflow-x-auto whitespace-pre-wrap leading-relaxed border-t border-[#d4c4b7]/30">
              {this.state.error?.stack || 'No stack trace available'}
            </pre>
          </details>

          <p className="text-[8px] text-[#9B8272] mt-6 italic">
            Please share Error ID with the development team if this issue persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

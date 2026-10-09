import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in bg-transparent relative">
      {/* Decorative badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
          <span className="text-4xl font-normal text-zinc-900 tracking-tight">404</span>
        </div>
      </div>

      {/* Main message */}
      <h1 className="text-2xl font-semibold text-zinc-900 mb-2 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-zinc-500 max-w-md mx-auto text-xs leading-relaxed mb-6 text-center font-normal">
        The requested resource is unavailable or has been relocated within the Vervast PMS architecture.
      </p>

      {/* Path display */}
      <div className="border border-zinc-200/80 rounded-md px-3 py-1.5 bg-zinc-50 mb-6">
        <span className="text-[10px] text-zinc-600 font-mono">
          {typeof window !== 'undefined' ? window.location.pathname : ''}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => navigate('/dashboard')} size="sm">
          Return to Dashboard
        </Button>
        <Button onClick={() => window.location.reload()} size="sm" variant="outline">
          Refresh Page
        </Button>
      </div>

      <p className="text-[9px] text-zinc-400 mt-8 tracking-wider uppercase">
        Vervast PMS Security & Routing Gateway
      </p>
    </div>
  );
}

export default NotFoundPage;

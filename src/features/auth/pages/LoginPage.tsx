import { LoginForm } from '../components/LoginForm';
import { Logo } from '@/components/ui/Logo';

export function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden text-[#4a3c31] bg-background"
    >

      <div className="z-10 w-full max-w-sm bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-6 lg:p-8">
        <div className="flex justify-center mb-6">
          <Logo className="w-24 h-auto" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

import { LoginForm } from '../components/LoginForm';
import bgLogin from '@/assets/bg/bg-login.png';

export function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative bg-cover bg-center bg-no-repeat select-none"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Floating Center Card */}
      <div className="z-10 w-full max-w-[390px] sm:max-w-[410px] bg-white/95 backdrop-blur-md rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.07),0_4px_12px_rgba(0,0,0,0.03)] border border-white/80 p-7 sm:p-9 transition-all duration-300">
        <LoginForm />
      </div>
    </div>
  );
}

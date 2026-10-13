import { LoginForm } from '../components/LoginForm';
import bgLogin from '@/assets/bg/bg-login.png';

export function LoginPage() {
  return (
    <div 
      className="min-h-screen w-full flex items-stretch justify-end pr-4 pt-8 pb-0 pl-4 relative bg-cover bg-center bg-no-repeat select-none"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Floating Center Card */}
      <div className="z-10 w-full max-w-[468px] sm:max-w-[492px] bg-white/95 backdrop-blur-md rounded-t-[12px] rounded-b-none shadow-[0_20px_50px_rgba(0,0,0,0.07),0_4px_12px_rgba(0,0,0,0.03)] border border-white/80 border-b-0 p-7 sm:p-9 sm:pb-28 flex flex-col justify-center transition-all duration-300">
        <LoginForm />
      </div>
    </div>
  );
}

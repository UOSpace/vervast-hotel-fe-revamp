import { LoginForm } from '../components/LoginForm';
import { Logo } from '@/components/ui/Logo';
import wellnessImage from '@/assets/wellness-wabi-sabi.png';

export function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-background text-foreground relative overflow-hidden">
      {/* Subtle ambient radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-foreground/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Floating Main Container matching Image 2 layout */}
      <div className="z-10 w-full max-w-5xl bg-card border-2 border-border/80 rounded-[28px] shadow-[0_6px_30px_-5px_rgba(0,0,0,0.06),0_2px_12px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_6px_30px_-5px_rgba(255,255,255,0.03)] p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-6 transition-all duration-300">
        
        {/* Left Side: Integrated Inner Rounded Panel with Black & White Wellness Image (Portrait fit) */}
        <div className="hidden lg:flex flex-1 relative rounded-[22px] overflow-hidden min-h-[540px] bg-neutral-900 shadow-inner">
          <img 
            src={wellnessImage} 
            alt="Wabi-Sabi Wellness Sanctuary" 
            className="w-full h-full object-cover object-center filter grayscale contrast-[1.05] brightness-[0.95] transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Right Side: Login Form with Small Logo at Top Center */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10 relative">
          {/* Small Logo at top center */}
          <div className="flex justify-center w-full pt-1">
            <Logo className="w-12 h-auto opacity-85 hover:opacity-100 transition-opacity" />
          </div>

          <div className="w-full max-w-sm mx-auto my-auto py-2">
            <LoginForm />
          </div>
        </div>

      </div>
    </div>
  );
}





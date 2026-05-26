import { LoginForm } from '../components/LoginForm';
import { SakuraAnimation } from '../components/SakuraAnimation';
import sakuraTree from '../../../assets/sakura-tree.png';

export function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 z-10 relative bg-background">
        <LoginForm />
      </div>

      {/* Right Column: Sakura Tree & Animation */}
      <div className="hidden lg:flex w-1/2 relative bg-card overflow-hidden items-center justify-center border-l border-border/50">
        {/* The generated Sakura Tree image */}
        <img 
          src={sakuraTree} 
          alt="Vintage Sakura Tree" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-lighten"
        />
        
        {/* Vignette effect for premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background opacity-50 z-10" />

        {/* Falling Sakura Leaves */}
        <SakuraAnimation />
      </div>
    </div>
  );
}

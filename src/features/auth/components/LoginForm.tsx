import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed, User, Lock } from '@solar-icons/react';
import { useLogin } from '../hooks/useLogin';
import { Logo } from '@/components/ui/Logo';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Zen / Enso Circle Logo */}
      <div className="flex justify-center mb-5">
        <Logo className="w-18 h-18 sm:w-20 sm:h-20 object-contain dark:invert-0" />
      </div>

      {/* Header */}
      <div className="text-center mb-7">
        <h1 className="text-2xl sm:text-[26px] font-medium tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 font-normal tracking-normal">
          Sign in to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <User size={18} />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="h-11 pl-10 pr-4 bg-[#FAFAFA] hover:bg-[#F4F4F5] focus:bg-white border border-neutral-200/90 rounded-md text-sm font-normal placeholder:text-neutral-400 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:border-neutral-400 shadow-none transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <Lock size={18} />
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="h-11 pl-10 pr-10 bg-[#FAFAFA] hover:bg-[#F4F4F5] focus:bg-white border border-neutral-200/90 rounded-md text-sm font-normal placeholder:text-neutral-400 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:border-neutral-400 shadow-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeClosed size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-0.5 pb-1">
          <a
            href="#"
            className="text-[11px] sm:text-xs font-normal text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 rounded-md font-medium text-sm bg-[#18181B] hover:bg-black text-white shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeClosed, User, Lock, Letter } from '@solar-icons/react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '@/components/ui/Logo';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    setValidationError('');
    await register({ name, email, password, confirmPassword });
  };

  const displayError = validationError || error;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Zen / Enso Circle Logo */}
      <div className="flex justify-center mb-5">
        <Logo className="w-18 h-18 sm:w-20 sm:h-20 object-contain dark:invert-0" />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-[26px] font-medium tracking-tight text-neutral-900">
          Create an Account
        </h1>
        <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 font-normal tracking-normal">
          Join Vervast Hospitality Network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-3.5">
        {displayError && (
          <div className="p-3 text-xs font-medium text-rose-600 bg-rose-50 rounded-md border border-rose-200/80 text-center">
            {displayError}
          </div>
        )}

        {/* Full Name */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <User size={18} />
          </div>
          <Input
            id="register-name"
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="h-11 pl-10 pr-4 bg-[#FAFAFA] hover:bg-[#F4F4F5] focus:bg-white border border-neutral-200/90 rounded-md text-sm font-normal placeholder:text-neutral-400 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:border-neutral-400 shadow-none transition-all"
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <Letter size={18} />
          </div>
          <Input
            id="register-email"
            type="email"
            placeholder="Work Email"
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
            id="register-password"
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer"
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center">
            <Lock size={18} />
          </div>
          <Input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            className="h-11 pl-10 pr-4 bg-[#FAFAFA] hover:bg-[#F4F4F5] focus:bg-white border border-neutral-200/90 rounded-md text-sm font-normal placeholder:text-neutral-400 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:border-neutral-400 shadow-none transition-all"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-md shadow-sm transition-all duration-200 mt-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Registering...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
}

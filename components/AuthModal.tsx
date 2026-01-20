import React, { useState } from 'react';
import { X, Mail, ArrowRight, Lock } from 'lucide-react';
import { Button } from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'email' | 'google' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider('email');
    setIsLoading(true);
    
    // Simulate email/password auth
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProvider(null);
      onAuthSuccess(email);
    }, 900);
  };

  const handleGoogleLogin = () => {
    setLoadingProvider('google');
    setIsLoading(true);

    // Simulate Google OAuth
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProvider(null);
      onAuthSuccess('google.user@gmail.com');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Sign in
            </h2>
            <p className="text-slate-500 text-sm">
              Use your email and password or sign in with Google.
            </p>
          </div>

          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center"
              size="lg"
              isLoading={isLoading && loadingProvider === 'google'}
              onClick={handleGoogleLogin}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-xs font-bold text-slate-600">
                G
              </span>
              Continue with Google
            </Button>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200"></div>
              or
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading && loadingProvider === 'email'}
              >
                Sign in <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              
              <p className="text-center text-xs text-slate-400">
                We'll create an account if you don't have one.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';

interface LoginProps {
  onLoginSuccess: (role: 'buyer' | 'developer' | 'admin') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple logic to determine role based on email for demo purposes
      if (email.toLowerCase().includes('admin')) {
        onLoginSuccess('admin');
      } else if (email.toLowerCase().includes('pixellabs')) {
        // Legacy support for specific demo developer account
        onLoginSuccess('developer');
      } else {
        // Default to buyer (User)
        onLoginSuccess('buyer');
      }
    }, 800);
  };

  const handleAdminEnter = () => {
      setEmail('admin@devehub.com');
      setPassword('admin123');
      onLoginSuccess('admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 text-center">
          <div className="inline-flex p-3 bg-white rounded-xl shadow-sm mb-4">
            <Icons.Code2 className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to DeveHub</h2>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
             <label className="flex items-center">
               <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 mr-2" />
               <span className="text-slate-600">Remember me</span>
             </label>
             <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full justify-center"
            size="lg"
          >
            Sign In
          </Button>

          <div className="text-center text-xs text-slate-400 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
        
        {/* Admin Quick Link */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
            <button 
                type="button" 
                onClick={handleAdminEnter} 
                className="text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-wider flex items-center justify-center mx-auto gap-1 transition-colors"
            >
                <Icons.Lock className="w-3 h-3" /> Admin Enter
            </button>
        </div>
      </div>
    </div>
  );
};
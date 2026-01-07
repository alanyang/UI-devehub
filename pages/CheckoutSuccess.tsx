import React from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { Project } from '../types';

interface CheckoutSuccessProps {
  project: Project;
  onGoHome: () => void;
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ project, onGoHome }) => {
  const licenseKey = `DH-${Math.floor(1000 + Math.random() * 9000)}-${project.name.substring(0,3).toUpperCase()}-LIFE`;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Icons.Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Successful!</h1>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        You now have lifetime access to <strong>{project.name}</strong>.
      </p>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Your License Key</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVE</span>
        </div>
        <div className="p-6 flex flex-col items-center">
          <code className="text-2xl font-mono font-bold text-slate-800 tracking-wider mb-4 select-all">
            {licenseKey}
          </code>
          <p className="text-xs text-slate-400 text-center mb-4">
            A copy has been sent to your email.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Icons.Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm max-w-md mb-8 flex items-start">
        <Icons.Zap className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
        <p>To activate, open {project.name} and paste this key into the settings menu.</p>
      </div>

      <Button onClick={onGoHome}>Return to Marketplace</Button>
    </div>
  );
};
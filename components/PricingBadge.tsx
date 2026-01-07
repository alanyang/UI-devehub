import React from 'react';
import { PricingTier } from '../types';

interface PricingBadgeProps {
  tier: PricingTier;
  className?: string;
}

export const PricingBadge: React.FC<PricingBadgeProps> = ({ tier, className = '' }) => {
  const styles = {
    [PricingTier.Free]: 'bg-slate-100 text-slate-600 border-slate-200',
    [PricingTier.Standard]: 'bg-primary-50 text-primary-700 border-primary-200',
    [PricingTier.Premium]: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const labels = {
    [PricingTier.Free]: 'Free',
    [PricingTier.Standard]: '$9.90 Lifetime',
    [PricingTier.Premium]: '$19.90 Lifetime',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[tier]} ${className}`}>
      {labels[tier]}
    </span>
  );
};

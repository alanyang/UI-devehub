
export enum PricingTier {
  Free = 'free',
  Standard = 'standard_9_9',
  Premium = 'premium_19_9'
}

export type PricingInterval = 'lifetime' | 'year';

export interface FeatureBlock {
  title: string;
  description: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  videoUrl?: string;
  pricingTier: PricingTier;
  interval: PricingInterval;
  categories: string[];
  developerName: string;
  projectSecret?: string;
  sales: number;
  revenue: number;
  status: 'active' | 'review' | 'draft' | 'rejected';
  ranking: number;
  isConsultationRequested?: boolean;
  appType?: 'web' | 'desktop' | 'mobile';
  appUrl?: string;
  features?: FeatureBlock[];
}

export interface License {
  id: string;
  key: string;
  projectId: string;
  projectName: string;
  amount: number;
  customerEmail: string;
  status: 'active' | 'refunded';
  payoutStatus: 'paid' | 'pending' | 'ready' | 'cancelled';
  paymentDate: string;        // User payment confirmed date
  expectedPayoutDate: string; // 60 days after payment
  purchaseDate?: string;      // Deprecated, kept for compatibility if needed, map to paymentDate
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'developer' | 'admin';
  status: 'active' | 'suspended' | 'inactive';
  joined: string;
  lastLogin: string;
  hasPurchases: boolean;
  hasUploads: boolean;
}

export type ViewState = 'login' | 'marketplace' | 'dashboard' | 'admin-dashboard' | 'product-detail' | 'checkout-success' | 'user-dashboard';
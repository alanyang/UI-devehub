import React, { useState, useEffect } from 'react';
import { Project, PricingTier } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { PricingBadge } from '../components/PricingBadge';
import { MOCK_LICENSES } from '../services/mockData';

interface ProductDetailProps {
  project: Project;
  isLoggedIn: boolean;
  onLoginReq: () => void;
  onBack: () => void;
  onPurchaseSuccess: (project: Project) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ project, isLoggedIn, onLoginReq, onBack, onPurchaseSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isOwned, setIsOwned] = useState(false);

  // Check if user owns the project (Simulation using hardcoded email)
  useEffect(() => {
    if (isLoggedIn) {
        // In a real app, you would check against the authenticated user's ID/Email
        const checkOwnership = MOCK_LICENSES.some(
            l => l.projectId === project.id && l.customerEmail === 'demo@user.com'
        );
        setIsOwned(checkOwnership);
    } else {
        setIsOwned(false);
    }
  }, [isLoggedIn, project.id]);

  // Combine images and optional video into one media array
  const mediaItems = [
    ...(project.videoUrl ? [{ type: 'video', url: project.videoUrl }] : []),
    ...project.images.map(url => ({ type: 'image', url }))
  ];

  const handleBuy = () => {
    if (isOwned) return; // Prevent purchase if owned
    
    if (!isLoggedIn) {
      onLoginReq();
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call to Stripe
    setTimeout(() => {
      setIsProcessing(false);
      onPurchaseSuccess(project);
    }, 2000);
  };

  const handleShare = () => {
    // Mock copy to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const nextSlide = () => {
    setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const priceMap = {
    [PricingTier.Free]: 0,
    [PricingTier.Standard]: 9.90,
    [PricingTier.Premium]: 19.90
  };

  const price = priceMap[project.pricingTier];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent">
          <Icons.ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Marketplace
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="relative transition-all duration-200">
          {isCopied ? (
            <span className="flex items-center text-green-600">
               <Icons.Check className="w-4 h-4 mr-2" /> Copied
            </span>
          ) : (
            <span className="flex items-center">
              <Icons.Share className="w-4 h-4 mr-2" /> Share
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Gallery & Details */}
        <div>
          {/* Gallery Slideshow */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4 border border-slate-100 bg-slate-900 aspect-video group">
             {mediaItems[activeMediaIndex].type === 'video' ? (
               <div className="w-full h-full flex items-center justify-center bg-black">
                  <video 
                    controls 
                    className="w-full h-full max-h-[400px]" 
                    src={mediaItems[activeMediaIndex].url}
                  >
                    Your browser does not support the video tag.
                  </video>
               </div>
             ) : (
               <img 
                 src={mediaItems[activeMediaIndex].url} 
                 alt={project.name} 
                 className="w-full h-full object-cover" 
               />
             )}
             
             {/* Navigation Arrows (Only show if > 1 item) */}
             {mediaItems.length > 1 && (
               <>
                 <button 
                   onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                   className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                 >
                   <Icons.ChevronLeft className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                   className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                 >
                   <Icons.ChevronRight className="w-5 h-5" />
                 </button>
               </>
             )}
          </div>

          {/* Thumbnails */}
          {mediaItems.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeMediaIndex === idx ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                     <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                       <Icons.Video className="w-6 h-6 text-white" />
                     </div>
                  ) : (
                    <img src={item.url} className="w-full h-full object-cover" alt="" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="prose prose-slate max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">About this Tool</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Feature Showcase / Rich Content (Zig-Zag) */}
          {project.features && project.features.length > 0 && (
             <div className="space-y-16">
               {project.features.map((feature, idx) => (
                 <div key={idx} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Section */}
                    <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                           {feature.description}
                        </p>
                    </div>
                    {/* Media Section */}
                    <div className="flex-1 w-full">
                       {feature.imageUrl && (
                           <div className="rounded-xl overflow-hidden border border-slate-100 shadow-lg bg-white">
                              {feature.mediaType === 'video' ? (
                                  <div className="aspect-video bg-black flex items-center justify-center">
                                      <video 
                                        controls 
                                        className="w-full h-full" 
                                        src={feature.imageUrl} // Note: imageUrl is storing the video URL
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                  </div>
                              ) : (
                                  <img src={feature.imageUrl} alt={feature.title} className="w-full h-auto object-cover" />
                              )}
                           </div>
                       )}
                    </div>
                 </div>
               ))}
             </div>
          )}
          {(!project.features || project.features.length === 0) && (
              <p className="text-sm text-slate-500 italic mt-8">
                 This tool integrates directly into your workflow. It has been vetted by the DeveHub team for security and performance.
                 By purchasing the lifetime deal, you support independent developers and get future updates for free.
              </p>
          )}

        </div>

        {/* Right Column: Checkout Card */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-extrabold text-slate-900">{project.name}</h1>
            </div>
            
            <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Lifetime Access</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-4xl font-extrabold text-slate-900">${price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-slate-500 font-medium line-through decoration-slate-400 opacity-60">
                    ${(price * 10).toFixed(0)}/yr
                  </span>
                </div>
              </div>
              <PricingBadge tier={project.pricingTier} className="scale-110" />
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <Icons.Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                <span>One-time payment, forever access</span>
              </li>
              <li className="flex items-center text-slate-600">
                <Icons.Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                <span>Instant License Key delivery</span>
              </li>
              <li className="flex items-center text-slate-600">
                <Icons.Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                <span>All future updates included</span>
              </li>
              <li className="flex items-center text-slate-600">
                <Icons.Lock className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <span>Secure payment via Stripe</span>
              </li>
            </ul>

            <Button 
              onClick={handleBuy} 
              isLoading={isProcessing} 
              variant="primary" 
              size="lg" 
              className={`w-full text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 ${
                isOwned ? 'bg-slate-300 hover:bg-slate-300 cursor-not-allowed shadow-none text-slate-500' : ''
              }`}
              disabled={isOwned || (project.pricingTier === PricingTier.Free && !isLoggedIn)} 
            >
              {isOwned 
                ? 'Already Owned' 
                : project.pricingTier === PricingTier.Free 
                    ? 'Get for Free' 
                    : isLoggedIn ? `Buy Lifetime Access` : 'Log In to Buy'
              }
            </Button>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-500">
                 <Icons.Refresh className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                 <p>
                   <span className="font-semibold text-slate-700">14-day money-back guarantee.</span> 
                   You can request a full refund within 14 days of purchase. No questions asked.
                 </p>
              </div>
              
              {project.pricingTier !== PricingTier.Free && (
                 <p className="text-[10px] text-center text-slate-300">
                   If the developer changes the price later, your lifetime access remains valid without extra cost.
                 </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
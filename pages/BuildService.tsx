import React from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';

export const BuildService: React.FC = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 shadow-sm mb-6 backdrop-blur-sm">
               <Icons.Zap className="w-4 h-4 text-yellow-400" />
               <span className="text-sm font-medium text-white/90">Official DeveHub Factory</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
               Turn Your AI Idea Into<br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">A Selling Product</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
               Don't let technical hurdles stop you. Whether you need a backend partner or a full-service team, we build the engine while you drive the vision.
            </p>
         </div>
      </div>

      {/* Service Modes */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mode A */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col hover:border-primary-200 transition-colors">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                     <Icons.Terminal className="w-7 h-7" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900">Mode A</h3>
                     <p className="text-slate-500 font-medium">Backend Partner</p>
                  </div>
               </div>

               <p className="text-slate-600 mb-8 flex-grow">
                  You build the frontend and user experience. We handle the heavy lifting: servers, databases, AI model integration, and API scaling. Perfect for frontend devs who want to move fast.
               </p>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">Scalable Server & Database Setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">Secure API Endpoints</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">AI Model Integration (LLMs, SD, etc)</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700"><strong>7 Days</strong> Turnaround</span>
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-100">
                  <Button variant="outline" size="lg" className="w-full">Start Mode A</Button>
               </div>
            </div>

            {/* Mode B (Premium) */}
            <div className="bg-slate-900 rounded-2xl shadow-2xl shadow-purple-500/20 border border-slate-800 p-8 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-transparent w-32 h-32 opacity-20 rounded-bl-full"></div>
               
               <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                     <Icons.Zap className="w-7 h-7" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-white">Mode B</h3>
                     <p className="text-primary-300 font-medium">Full Service Agency</p>
                  </div>
               </div>

               <p className="text-slate-300 mb-8 flex-grow relative z-10">
                  We handle everything from start to finish. From the initial UI draft to the final deployment and testing. You provide the vision, we deliver a fully functional, sellable product.
               </p>

               {/* Timeline Graphic */}
               <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700/50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Development Timeline</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-300"><strong>Day 1-3:</strong> UI Draft & Interactions</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-slate-300"><strong>Day 4-10:</strong> Development & Integration</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-300"><strong>Day 11-17:</strong> Testing & Final Review</span>
                     </div>
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-800 relative z-10">
                  <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary-500/25">Start Mode B</Button>
               </div>
            </div>

         </div>
      </div>
      
      {/* FAQ / Trust */}
      <div className="max-w-3xl mx-auto mt-20 px-4 text-center">
         <h2 className="text-2xl font-bold text-slate-900 mb-4">Why build with DeveHub?</h2>
         <p className="text-slate-500">
            We know what sells on our marketplace. Apps built by our team are automatically optimized for the DeveHub platform, ensuring seamless license integration and high-quality user experience standards.
         </p>
         <div className="mt-8 flex justify-center gap-8">
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">100%</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">IP Ownership</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">24/7</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">Support</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">Speed</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">To Market</span>
            </div>
         </div>
      </div>
    </div>
  );
};
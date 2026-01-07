import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';

export const BuildService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 shadow-sm mb-6 backdrop-blur-sm">
               <Icons.Zap className="w-4 h-4 text-yellow-400" />
               <span className="text-sm font-medium text-white/90">{t('buildService.hero.officialFactory')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
               {t('buildService.hero.titlePrefix')}<br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">{t('buildService.hero.titleSuffix')}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
               {t('buildService.hero.subtitle')}
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
                     <h3 className="text-2xl font-bold text-slate-900">{t('buildService.modeA.title')}</h3>
                     <p className="text-slate-500 font-medium">{t('buildService.modeA.role')}</p>
                  </div>
               </div>

               <p className="text-slate-600 mb-8 flex-grow">
                  {t('buildService.modeA.description')}
               </p>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">{t('buildService.modeA.feat1')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">{t('buildService.modeA.feat2')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700">{t('buildService.modeA.feat3')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Icons.Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                     <span className="text-slate-700"><strong>{t('buildService.modeA.feat4Prefix')}</strong> {t('buildService.modeA.feat4Suffix')}</span>
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-100">
                  <Button variant="outline" size="lg" className="w-full">{t('buildService.modeA.cta')}</Button>
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
                     <h3 className="text-2xl font-bold text-white">{t('buildService.modeB.title')}</h3>
                     <p className="text-primary-300 font-medium">{t('buildService.modeB.role')}</p>
                  </div>
               </div>

               <p className="text-slate-300 mb-8 flex-grow relative z-10">
                  {t('buildService.modeB.description')}
               </p>

               {/* Timeline Graphic */}
               <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700/50">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('buildService.modeB.timelineTitle')}</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-300"><strong>{t('buildService.modeB.timeline1Prefix')}</strong> {t('buildService.modeB.timeline1Suffix')}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-slate-300"><strong>{t('buildService.modeB.timeline2Prefix')}</strong> {t('buildService.modeB.timeline2Suffix')}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-300"><strong>{t('buildService.modeB.timeline3Prefix')}</strong> {t('buildService.modeB.timeline3Suffix')}</span>
                     </div>
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-800 relative z-10">
                  <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary-500/25">{t('buildService.modeB.cta')}</Button>
               </div>
            </div>

         </div>
      </div>
      
      {/* FAQ / Trust */}
      <div className="max-w-3xl mx-auto mt-20 px-4 text-center">
         <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('buildService.trust.title')}</h2>
         <p className="text-slate-500">
            {t('buildService.trust.description')}
         </p>
         <div className="mt-8 flex justify-center gap-8">
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">100%</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('buildService.trust.stat1')}</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">24/7</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('buildService.trust.stat2')}</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-3xl font-bold text-slate-900">{t('buildService.trust.stat3Value')}</span>
               <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('buildService.trust.stat3Label')}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

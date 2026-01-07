import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icons } from '../components/Icons';
import { ProjectCard } from '../components/ProjectCard';
import { MOCK_PROJECTS } from '../services/mockData';
import { Project } from '../types';

interface MarketplaceProps {
  onProductClick: (project: Project) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onProductClick }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = ['All', 'Productivity', 'DevTools', 'Design', 'AI', 'Marketing', 'Business', 'Self-improvement'];

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary-50 via-white to-transparent -z-10 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px]"></div>
         <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
               <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
               <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('marketplace.liveOnDeveHub')}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {t('marketplace.title')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">{t('marketplace.subtitle')}</span>
            </h1>

            <p className="text-2xl text-slate-700 font-medium leading-relaxed max-w-lg">
              {t('marketplace.tagline')}
            </p>
            <p className="text-base text-slate-500 max-w-lg">
               {t('marketplace.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative w-full max-w-2xl">
                <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-primary-500/5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg text-slate-900 placeholder-slate-400 transition-all hover:shadow-2xl hover:shadow-primary-500/10"
                  placeholder={t('marketplace.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-slate-500 pt-4">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://picsum.photos/40/40?random=${i+20}`} className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                 ))}
               </div>
               <p>{t('marketplace.trustedBy')}</p>
            </div>
          </div>

          {/* Hero Illustration / Comparison */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-purple-100 rounded-[2rem] transform rotate-3 -z-10 blur-xl opacity-60"></div>
             
             <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                <h3 className="text-lg font-bold text-slate-900 mb-10 text-center flex items-center justify-center gap-2">
                  {t('comparison.title')}
                </h3>

                <div className="flex items-center justify-center gap-8 relative px-4 pb-4">
                   
                   {/* Left: The Old Way (SaaS Trap) */}
                   <div className="flex-1 flex flex-col items-center justify-center group/trap">
                      <div className="relative w-36 h-48 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover/trap:scale-95 group-hover/trap:bg-slate-100">
                         {/* Card Content */}
                         <div className="w-full flex justify-between mb-6 opacity-30">
                            <div className="w-8 h-1 bg-slate-400 rounded"></div>
                            <div className="w-4 h-1 bg-slate-400 rounded"></div>
                         </div>

                         <div className="text-xs text-slate-400 font-bold mb-1 tracking-wider">{t('comparison.oldWay.period')}</div>
                         <div className="text-3xl font-bold text-slate-300 line-through decoration-red-400/50 decoration-4">{t('comparison.oldWay.price')}</div>
                         <div className="text-[10px] text-slate-400 mt-3 text-center leading-tight"> {t('comparison.oldWay.description')}</div>

                         {/* Red X Overlay */}
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover/trap:opacity-80 transition-opacity">
                            <Icons.X className="w-24 h-24 text-red-500" />
                         </div>
                      </div>
                      <div className="text-center mt-4">
                         <p className="font-medium text-slate-400 text-sm">{t('comparison.oldWay.title')}</p>
                      </div>
                   </div>

                   {/* Center: VS Badge */}
                   <div className="z-10 flex-shrink-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-sm font-black text-slate-200 italic mb-8">
                        VS
                      </div>
                   </div>

                   {/* Right: The DeveHub Way (Premium Card) */}
                   <div className="flex-1 flex flex-col items-center justify-center relative group">
                      {/* Floating Badge */}
                      <div className="absolute -top-6 -right-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-500/30 animate-bounce z-20 whitespace-nowrap border-2 border-white transform rotate-3">
                        {t('comparison.save95')}
                      </div>

                      {/* The Premium Card */}
                      <div className="relative w-40 h-56 bg-slate-900 rounded-2xl shadow-2xl shadow-primary-900/40 flex flex-col p-5 overflow-hidden transform group-hover:-translate-y-2 group-hover:shadow-primary-900/60 transition-all duration-300 border border-slate-700/50">
                         {/* Abstract Background */}
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 opacity-90"></div>
                         <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl"></div>
                         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>

                         {/* Content */}
                         <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                                   <Icons.Brain className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-[9px] font-mono text-white/60 border border-white/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                   PRO License
                                </div>
                            </div>

                            <div className="text-center py-2 mt-2">
                                <div className="text-[10px] text-white/60 font-medium tracking-widest uppercase mb-1">{t('comparison.newWay.period')}</div>
                                <div className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">{t('comparison.newWay.price')}</div>
                            </div>

                            <div className="space-y-2 mt-auto">
                               <div className="flex items-center gap-2 text-[10px] text-white/90 bg-white/10 p-1.5 rounded border border-white/10 backdrop-blur-sm">
                                  <div className="bg-green-500 rounded-full p-0.5"><Icons.Check className="w-2 h-2 text-white" /></div>
                                  <span className="font-medium">{t('comparison.newWay.lifetimeAccess')}</span>
                               </div>
                               <div className="flex items-center gap-2 text-[10px] text-white/90 bg-white/10 p-1.5 rounded border border-white/10 backdrop-blur-sm">
                                  <div className="bg-green-500 rounded-full p-0.5"><Icons.Check className="w-2 h-2 text-white" /></div>
                                  <span className="font-medium">{t('comparison.newWay.freeUpdates')}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="text-center mt-5">
                        <p className="font-bold text-slate-800 text-lg">{t('comparison.newWay.title')}</p>
                      </div>
                   </div>

                </div>
                
                <div className="mt-8 bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-500 border border-slate-200/60 mx-auto max-w-sm italic">
                   "{t('comparison.quote')}"
                </div>
             </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-col items-center justify-center space-y-8 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 uppercase ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="h-full">
                 <ProjectCard project={project} onClick={onProductClick} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <Icons.Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{t('marketplace.noToolsFound')}</h3>
            <p className="text-slate-500">{t('marketplace.tryAdjusting')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
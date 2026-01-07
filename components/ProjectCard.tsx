import React, { useState } from 'react';
import { Project } from '../types';
import { Icons } from './Icons';
import { Button } from './Button';
import { PricingBadge } from './PricingBadge';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Unified media list with Video first
  const mediaItems = [
    ...(project.videoUrl ? [{ type: 'video', url: project.videoUrl }] : []),
    ...project.images.map(url => ({ type: 'image', url }))
  ];

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer h-full relative"
      onClick={() => onClick(project)}
    >
      {/* Media Carousel */}
      <div className="relative h-40 bg-slate-900 overflow-hidden">
        {mediaItems[currentMediaIndex].type === 'video' ? (
           <div className="w-full h-full flex items-center justify-center bg-black relative">
              <video 
                src={mediaItems[currentMediaIndex].url}
                className="w-full h-full object-cover opacity-80"
                muted
                loop
                autoPlay={false} // Don't autoplay in card to save resources, just show thumbnail essentially
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                    <Icons.Video className="w-6 h-6 text-white" />
                 </div>
              </div>
           </div>
        ) : (
          <img 
            src={mediaItems[currentMediaIndex].url} 
            alt={project.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
        {/* Overlay Gradient (Only for images) */}
        {mediaItems[currentMediaIndex].type === 'image' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        )}

        {/* Pricing Badge */}
        <div className="absolute top-3 right-3 z-10">
          <PricingBadge tier={project.pricingTier} className="shadow-lg backdrop-blur-md bg-white/90" />
        </div>

        {/* Categories */}
        <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
           {project.categories.slice(0, 2).map(cat => (
             <span key={cat} className="bg-white/20 backdrop-blur-md border border-white/30 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm">
               {cat}
             </span>
           ))}
        </div>

        {/* Slideshow Controls - Only visible on hover if multiple items */}
        {mediaItems.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <button 
              onClick={prevMedia}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg transform hover:scale-110 transition-all pointer-events-auto"
            >
              <Icons.ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextMedia}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg transform hover:scale-110 transition-all pointer-events-auto"
            >
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {mediaItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {project.name}
            </h3>
          </div>
          {/* Reduced line clamp to make card shorter */}
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center group/dev">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover/dev:border-primary-200 transition-colors">
              {project.developerName.charAt(0)}
            </div>
            <span className="ml-2 text-xs text-slate-500 font-medium group-hover/dev:text-primary-600 transition-colors">
              {project.developerName}
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs border-primary-100 hover:border-primary-300 hover:bg-primary-50 text-primary-700">
            View Deal
            <Icons.ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
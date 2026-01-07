import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { PricingTier, Project, PricingInterval, License, FeatureBlock } from '../types';
import { MOCK_PROJECTS, REVENUE_DATA, MOCK_LICENSES } from '../services/mockData';

const AVAILABLE_CATEGORIES = ['Productivity', 'DevTools', 'Design', 'AI', 'Marketing', 'Business', 'Self-improvement', 'Writing'];

// --- Helper Functions for Payout Logic ---
const getNextPayoutDate = () => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let nextPayoutDay = 14;
  let nextPayoutMonth = currentMonth;
  let nextPayoutYear = currentYear;

  if (currentDay < 14) {
    nextPayoutDay = 14;
  } else if (currentDay < 28) {
    nextPayoutDay = 28;
  } else {
    // Next month 14th
    nextPayoutDay = 14;
    nextPayoutMonth = currentMonth + 1;
    if (nextPayoutMonth > 11) {
      nextPayoutMonth = 0;
      nextPayoutYear++;
    }
  }

  const date = new Date(nextPayoutYear, nextPayoutMonth, nextPayoutDay);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

// Reusable Coming Soon Component
const ComingSoon: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 min-h-[400px]">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
      <Icons.Sparkles className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 max-w-md">{description}</p>
    <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
      Coming Soon
    </div>
  </div>
);

// Separate component for Project Details to avoid render issues
const ProjectDetailView: React.FC<{ 
  project: Project, 
  onBack: () => void,
  onUpdate: (updated: Project) => void,
  licenses: License[]
}> = ({ project, onBack, onUpdate, licenses }) => {
    const [detailTab, setDetailTab] = useState<'overview' | 'payouts' | 'customers' | 'settings'>('overview');
    const [editMode, setEditMode] = useState(false);
    
    // Local state for editing
    const [editedProject, setEditedProject] = useState<Project>(project);
    
    // Filter licenses for this project
    const projectLicenses = licenses.filter(l => l.projectId === project.id);
    const paidLicenses = projectLicenses.filter(l => l.payoutStatus === 'paid' || l.payoutStatus === 'ready');
    const pendingLicenses = projectLicenses.filter(l => l.payoutStatus === 'pending');
    
    // Mock calculations
    const availablePayout = paidLicenses.reduce((sum, l) => sum + (l.amount * 0.9), 0); // 90% share
    const pendingPayout = pendingLicenses.reduce((sum, l) => sum + (l.amount * 0.9), 0);
    
    // Mock Next Payout Date
    const nextPayoutDate = getNextPayoutDate();

    const handleSave = () => {
        onUpdate(editedProject);
        setEditMode(false);
        alert("Project settings saved!");
    };

    const handleAddImage = () => {
        if(editedProject.images.length < 10) {
            setEditedProject({
                ...editedProject,
                images: [...editedProject.images, `https://picsum.photos/800/600?random=${Date.now()}`]
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...editedProject.images];
        newImages.splice(index, 1);
        setEditedProject({...editedProject, images: newImages});
    };

    // Features Management
    const handleAddFeature = () => {
        const newFeature: FeatureBlock = {
            title: 'New Feature Title',
            description: 'Describe your feature here...',
            imageUrl: `https://picsum.photos/800/500?random=${Date.now()}`,
            mediaType: 'image'
        };
        setEditedProject({
            ...editedProject,
            features: [...(editedProject.features || []), newFeature]
        });
    };

    const handleUpdateFeature = (index: number, field: string, value: string) => {
        const updatedFeatures = [...(editedProject.features || [])];
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
        setEditedProject({ ...editedProject, features: updatedFeatures });
    };

    const handleRemoveFeature = (index: number) => {
        const updatedFeatures = [...(editedProject.features || [])];
        updatedFeatures.splice(index, 1);
        setEditedProject({ ...editedProject, features: updatedFeatures });
    };

    const handleFeatureUploadMock = (index: number) => {
        // Simulate upload
        handleUpdateFeature(index, 'imageUrl', `https://picsum.photos/800/500?random=${Date.now()}`);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={onBack}>
               <Icons.ChevronLeft className="w-4 h-4 mr-1" /> Back
             </Button>
             <div>
               <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
               <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${project.status === 'active' ? 'bg-green-100 text-green-700' : project.status === 'draft' ? 'bg-slate-200 text-slate-700' : 'bg-yellow-100 text-yellow-700'}`}>
                 {project.status}
               </span>
             </div>
           </div>
           
           <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(project.videoUrl || '#', '_blank')}>
                <Icons.ExternalLink className="w-4 h-4 mr-2" /> View Listing
              </Button>
              <Button variant={editMode ? 'primary' : 'outline'} size="sm" onClick={() => { setEditMode(!editMode); setDetailTab('settings'); }}>
                {editMode ? 'Cancel Edit' : 'Edit Project'}
              </Button>
           </div>
        </div>

        {/* Sub-Navigation */}
        {!editMode && (
          <div className="border-b border-slate-200 flex space-x-6 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'payouts', label: 'Performance & Payouts' },
              { id: 'customers', label: 'Customers' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id as any)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  detailTab === tab.id 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* --- TAB: OVERVIEW --- */}
        {detailTab === 'overview' && !editMode && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-sm text-slate-500 mb-1">Total Revenue</div>
                   <div className="text-3xl font-bold text-slate-900">${project.revenue.toFixed(2)}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-sm text-slate-500 mb-1">Sales</div>
                   <div className="text-3xl font-bold text-slate-900">{project.sales}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-sm text-slate-500 mb-1">Conversion Rate</div>
                   <div className="text-3xl font-bold text-slate-900">4.2%</div>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Icons.Code2 className="w-4 h-4 mr-2" /> Quick API Access
                </h3>
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <Icons.Lock className="w-4 h-4 text-slate-400" />
                    <code className="text-sm font-mono text-slate-600 flex-1 overflow-hidden text-ellipsis">
                      {project.projectSecret || 'sk_live_...'}
                    </code>
                    <Button size="sm" variant="ghost">Copy</Button>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: PAYOUTS --- */}
        {detailTab === 'payouts' && !editMode && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-green-800 text-sm font-bold uppercase tracking-wider">Available</span>
                     <Icons.Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-900">${availablePayout.toFixed(2)}</div>
                  <div className="text-xs text-green-700 mt-2">Ready for next payout cycle</div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Pending</span>
                     <Icons.Lock className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">${pendingPayout.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-2">Held for 60-day refund window</div>
               </div>

               <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm text-white">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Next Payout</span>
                     <Icons.CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold">{nextPayoutDate}</div>
                  <div className="text-xs text-slate-400 mt-2">Est. Amount: ${(availablePayout).toFixed(2)}</div>
               </div>
            </div>
          </div>
        )}

        {/* --- TAB: SETTINGS (OR EDIT MODE) --- */}
        {(detailTab === 'settings' || editMode) && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
             {/* ... Project Settings UI ... */}
             <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">General Info</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                <input 
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Feature Showcase (Moved Up) */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Feature Showcase (Rich Content)</h4>
                    <Button size="sm" variant="outline" onClick={handleAddFeature}>
                        <Icons.Plus className="w-3 h-3 mr-1" /> Add Feature
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(editedProject.features || []).map((feature, idx) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-slate-500">Feature Block {idx + 1}</span>
                                <button onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700">
                                    <Icons.X className="w-4 h-4" />
                                </button>
                            </div>
                            <input 
                                type="text"
                                placeholder="Feature Title"
                                value={feature.title}
                                onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold"
                            />
                            <textarea 
                                rows={2}
                                placeholder="Feature Description"
                                value={feature.description}
                                onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            
                            {/* Media Type Selector */}
                            <div className="flex gap-4 text-xs font-medium text-slate-600">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name={`mediaType-${idx}`}
                                        checked={feature.mediaType !== 'video'} // Default to image
                                        onChange={() => handleUpdateFeature(idx, 'mediaType', 'image')}
                                    />
                                    Image
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name={`mediaType-${idx}`}
                                        checked={feature.mediaType === 'video'}
                                        onChange={() => handleUpdateFeature(idx, 'mediaType', 'video')}
                                    />
                                    Video Link
                                </label>
                            </div>

                            {/* Conditional Input based on Media Type */}
                            {feature.mediaType === 'video' ? (
                                <div className="flex gap-2">
                                    <div className="w-10 flex items-center justify-center bg-slate-100 rounded border border-slate-200 text-slate-400">
                                        <Icons.Video className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Video URL (e.g. mp4 link)"
                                        value={feature.imageUrl} // Using imageUrl field to store video URL to simplify data model or we could separate
                                        onChange={(e) => handleUpdateFeature(idx, 'imageUrl', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-500"
                                    />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        placeholder="Image URL"
                                        value={feature.imageUrl}
                                        onChange={(e) => handleUpdateFeature(idx, 'imageUrl', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-500"
                                    />
                                    <button 
                                        onClick={() => handleFeatureUploadMock(idx)}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium flex items-center gap-1"
                                    >
                                        <Icons.Upload className="w-3 h-3" /> Upload
                                    </button>
                                    {feature.imageUrl && (
                                        <img src={feature.imageUrl} alt="preview" className="h-8 w-12 object-cover rounded bg-slate-200" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* End Feature Showcase */}

            {/* Media Settings (Images & Video) */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Media Gallery (Listing)</h4>
                
                <div className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Demo Video URL (MP4)</label>
                       <div className="flex gap-2">
                           <input 
                               type="text" 
                               value={editedProject.videoUrl || ''}
                               onChange={(e) => setEditedProject({...editedProject, videoUrl: e.target.value})}
                               className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                               placeholder="https://..."
                           />
                           <Button size="sm" variant="outline" onClick={() => window.open(editedProject.videoUrl, '_blank')}>Test</Button>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Screenshots</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {editedProject.images.map((img, idx) => (
                               <div key={idx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                   <img src={img} alt="" className="w-full h-full object-cover" />
                                   <button 
                                      onClick={() => handleRemoveImage(idx)}
                                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                       <Icons.X className="w-3 h-3" />
                                   </button>
                               </div>
                           ))}
                           <div 
                              onClick={handleAddImage}
                              className="aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 transition-colors"
                           >
                               <Icons.Plus className="w-6 h-6 mb-1" />
                               <span className="text-xs">Add Image</span>
                           </div>
                       </div>
                   </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
               <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
               <Button onClick={handleSave}>Save All Changes</Button>
            </div>
          </div>
        )}
      </div>
    );
};

// --- Main Dashboard Component ---
interface DashboardProps {
    licenses?: License[];
}

export const Dashboard: React.FC<DashboardProps> = ({ licenses = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'new-project' | 'settings' | 'financials' | 'payout-settings'>('overview');
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  // State for Project List (so created projects persist in list)
  const [myProjects, setMyProjects] = useState<Project[]>(MOCK_PROJECTS);

  // Create Project Wizard State
  const [createStep, setCreateStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState('');
  
  // Developer Settings State
  const [payoutMethod, setPayoutMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paypalEmail, setPaypalEmail] = useState('support@pixellabs.com');
  const [isPayoutVerified, setIsPayoutVerified] = useState(true);
  
  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [pendingPayoutChange, setPendingPayoutChange] = useState<null | (() => void)>(null);

  // Financial Filter
  const [selectedFinancialProject, setSelectedFinancialProject] = useState<string>('all');
  const [financialSort, setFinancialSort] = useState<'newest' | 'oldest'>('newest');
  const [financialStatusFilter, setFinancialStatusFilter] = useState<'all' | 'active' | 'refunded'>('all');
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tier: PricingTier.Standard as string,
    interval: 'lifetime' as PricingInterval,
    categories: [] as string[],
    images: [] as string[],
    videoName: '',
    isConsultationRequested: false,
    appType: 'web' as 'web' | 'desktop' | 'mobile',
    appUrl: '',
    features: [] as FeatureBlock[]
  });

  const totalRevenue = myProjects.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = myProjects.reduce((sum, p) => sum + p.sales, 0);

  // Initialize secret once
  React.useEffect(() => {
    if (activeTab === 'new-project' && !generatedSecret) {
      setGeneratedSecret(`sk_live_dh_${Math.random().toString(36).substring(7)}_${Date.now()}`);
    }
  }, [activeTab]);

  // Helper to create the project object
  const constructProject = (status: 'active' | 'draft'): Project => ({
      id: `proj_${Date.now()}`,
      name: newProject.name || 'Untitled Project',
      description: newProject.description,
      images: newProject.images,
      videoUrl: newProject.videoName ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined,
      pricingTier: newProject.tier as PricingTier,
      interval: newProject.interval,
      categories: newProject.categories,
      developerName: 'PixelLabs', // Hardcoded for demo
      projectSecret: generatedSecret,
      sales: 0,
      revenue: 0,
      status: status,
      ranking: 99,
      isConsultationRequested: newProject.isConsultationRequested,
      appType: newProject.appType,
      appUrl: newProject.appUrl,
      features: newProject.features
  });

  const handleSaveDraft = () => {
    const draft = constructProject('draft');
    setMyProjects([...myProjects, draft]);
    alert("Project saved as draft!");
    setActiveTab('overview');
  };

  const handleCreateProject = () => {
    const created = constructProject('active');
    setMyProjects([...myProjects, created]);
    // Move to step 4: Success & Integration
    setCreateStep(4);
  };

  const handleUpdateProject = (updated: Project) => {
    setMyProjects(myProjects.map(p => p.id === updated.id ? updated : p));
    setViewingProject(updated); // Keep viewing updated
  };

  const initiatePayoutSave = () => {
     setShowVerifyModal(true);
     setVerifyCode('');
  };

  const completePayoutSave = () => {
     if (verifyCode === '123456') {
        setShowVerifyModal(false);
        alert("Payout settings updated securely.");
     } else {
        alert("Invalid code. Try 123456");
     }
  };

  // Mock File Upload Handlers
  const handleImageUpload = (isEditing = false, projectState: any = null, setProjectState: any = null) => {
    const targetState = isEditing ? projectState : newProject;
    const setTarget = isEditing ? setProjectState : setNewProject;
    
    if (targetState.images.length < 10) {
      setTarget({
        ...targetState,
        images: [...targetState.images, `https://picsum.photos/800/600?random=${Math.random()}`]
      });
    }
  };

  const handleVideoUpload = (isEditing = false, projectState: any = null, setProjectState: any = null) => {
    const targetState = isEditing ? projectState : newProject;
    const setTarget = isEditing ? setProjectState : setNewProject;
    setTarget({ ...targetState, videoName: 'demo_video.mp4', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' });
  };

  const toggleCategory = (cat: string) => {
    if (newProject.categories.includes(cat)) {
      setNewProject({ ...newProject, categories: newProject.categories.filter(c => c !== cat) });
    } else {
      if (newProject.categories.length < 3) {
        setNewProject({ ...newProject, categories: [...newProject.categories, cat] });
      }
    }
  };

  // --- Render Create Wizard ---
  const renderCreateWizard = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Wizard Steps Header - Hidden on Step 4 (Success) */}
      {createStep < 4 && (
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6 relative">
            {[{ num: 1, label: "App Essentials" }, { num: 2, label: "Setup & Pricing" }, { num: 3, label: "Review" }].map((step) => (
            <div key={step.num} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                createStep >= step.num ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 text-slate-400'
                }`}>
                {step.num}
                </div>
                <span className={`text-xs font-medium mt-2 ${createStep >= step.num ? 'text-primary-700' : 'text-slate-400'}`}>
                {step.label}
                </span>
            </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-[20px] left-[20%] right-[20%] h-0.5 bg-slate-100 -z-0">
            <div 
                className="h-full bg-primary-200 transition-all duration-300" 
                style={{ width: `${((createStep - 1) / 2) * 100}%` }}
            />
            </div>
        </div>
      )}

      {createStep === 1 && (
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-300">
            {/* Form Fields for Step 1 - Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center"><Icons.FileText className="w-5 h-5 mr-2 text-primary-500" /> Basic Info</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Super AI Writer" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="What does your tool do?" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                  </div>
                  
                  {/* App Type & URL */}
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Application Type</label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {(['web', 'mobile', 'desktop'] as const).map((type) => (
                           <button 
                             key={type}
                             className={`px-3 py-2 border rounded-lg text-sm font-medium capitalize ${newProject.appType === type ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                             onClick={() => setNewProject({...newProject, appType: type})}
                           >
                             {type} App
                           </button>
                        ))}
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Application URL</label>
                      <input 
                        type="url" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 placeholder-slate-400" 
                        placeholder={newProject.appType === 'web' ? "https://myapp.com" : newProject.appType === 'mobile' ? "App Store / Play Store Link" : "Download Link (.zip/.exe)"}
                        value={newProject.appUrl} 
                        onChange={e => setNewProject({...newProject, appUrl: e.target.value})} 
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Categories (Max 3)</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_CATEGORIES.map(cat => (
                          <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${newProject.categories.includes(cat) ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>{cat}</button>
                        ))}
                      </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center"><Icons.Image className="w-5 h-5 mr-2 text-primary-500" /> Media Gallery</h2>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
                     <div className="grid grid-cols-1 gap-4">
                         <div onClick={() => handleImageUpload(false)} className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-500 hover:bg-white transition-all cursor-pointer h-40 flex flex-col items-center justify-center">
                            <Icons.Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-900">Upload Screenshots</p>
                         </div>
                     </div>
                     {(newProject.images.length > 0) && <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-200">{newProject.images.map((_, i) => <div key={i} className="bg-white text-slate-600 px-2 py-1 rounded text-xs border flex items-center"><Icons.Image className="w-3 h-3 mr-1" /> Img {i + 1}</div>)}</div>}
                  </div>
                </div>
            </div>

            {/* Feature Showcase in Wizard - Full Width */}
            <div className="border-t border-slate-200 pt-8">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center"><Icons.Sparkles className="w-5 h-5 mr-2 text-primary-500" /> Feature Showcase</h2>
                        <p className="text-sm text-slate-500 mt-1">Add rich details about your product features to increase conversion.</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setNewProject({...newProject, features: [...newProject.features, { title: '', description: '', imageUrl: '', mediaType: 'image' }]})}>
                          <Icons.Plus className="w-3 h-3 mr-1" /> Add Feature
                      </Button>
                  </div>
                  
                  <div className="space-y-6">
                      {newProject.features.map((feature, idx) => (
                          <div key={idx} className="p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-4 hover:border-primary-200 transition-colors">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Feature Block {idx + 1}</span>
                                  <button onClick={() => {
                                      const updated = [...newProject.features];
                                      updated.splice(idx, 1);
                                      setNewProject({...newProject, features: updated});
                                  }} className="text-red-500 hover:text-red-700 bg-white p-1 rounded-full border border-slate-200 hover:border-red-200">
                                      <Icons.X className="w-4 h-4" />
                                  </button>
                              </div>
                              <input 
                                  type="text"
                                  placeholder="Feature Title (e.g., 'One-Click Deploy')"
                                  value={feature.title}
                                  onChange={(e) => {
                                      const updated = [...newProject.features];
                                      updated[idx].title = e.target.value;
                                      setNewProject({...newProject, features: updated});
                                  }}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base font-bold focus:ring-2 focus:ring-primary-500"
                              />
                              <textarea 
                                  rows={3}
                                  placeholder="Describe the benefit to the user..."
                                  value={feature.description}
                                  onChange={(e) => {
                                      const updated = [...newProject.features];
                                      updated[idx].description = e.target.value;
                                      setNewProject({...newProject, features: updated});
                                  }}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                              />
                              
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex gap-4 text-sm font-medium text-slate-600 items-center min-w-[150px]">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300">
                                        <input 
                                            type="radio" 
                                            name={`w-mediaType-${idx}`}
                                            checked={feature.mediaType !== 'video'} 
                                            onChange={() => {
                                                const updated = [...newProject.features];
                                                updated[idx].mediaType = 'image';
                                                setNewProject({...newProject, features: updated});
                                            }}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <Icons.Image className="w-4 h-4" />
                                        <span>Image</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300">
                                        <input 
                                            type="radio" 
                                            name={`w-mediaType-${idx}`}
                                            checked={feature.mediaType === 'video'}
                                            onChange={() => {
                                                const updated = [...newProject.features];
                                                updated[idx].mediaType = 'video';
                                                setNewProject({...newProject, features: updated});
                                            }}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <Icons.Video className="w-4 h-4" />
                                        <span>Video</span>
                                    </label>
                                  </div>

                                  <div className="flex-1">
                                      {feature.mediaType === 'video' ? (
                                        <input 
                                            type="text"
                                            placeholder="Video URL (mp4 link)"
                                            value={feature.imageUrl}
                                            onChange={(e) => {
                                                const updated = [...newProject.features];
                                                updated[idx].imageUrl = e.target.value;
                                                setNewProject({...newProject, features: updated});
                                            }}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-500 focus:ring-2 focus:ring-primary-500"
                                        />
                                      ) : (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                placeholder="Image URL"
                                                value={feature.imageUrl}
                                                onChange={(e) => {
                                                    const updated = [...newProject.features];
                                                    updated[idx].imageUrl = e.target.value;
                                                    setNewProject({...newProject, features: updated});
                                                }}
                                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-500 focus:ring-2 focus:ring-primary-500"
                                            />
                                            <button 
                                                onClick={() => {
                                                    const updated = [...newProject.features];
                                                    updated[idx].imageUrl = `https://picsum.photos/800/500?random=${Date.now()}`;
                                                    setNewProject({...newProject, features: updated});
                                                }}
                                                className="px-4 py-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium flex items-center gap-2 transition-colors"
                                            >
                                                <Icons.Upload className="w-4 h-4" /> Upload
                                            </button>
                                        </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                      {newProject.features.length === 0 && (
                          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                                  <Icons.Sparkles className="w-6 h-6 text-primary-400" />
                              </div>
                              <p className="text-slate-500 text-sm">No features added yet. Click "Add Feature" to showcase your product.</p>
                          </div>
                      )}
                  </div>
            </div>
        </div>
      )}

      {createStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Icons.CreditCard className="w-5 h-5 mr-2 text-primary-500" /> Pricing Strategy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Free Tier */}
              <div 
                  onClick={() => setNewProject({...newProject, tier: PricingTier.Free})} 
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${newProject.tier === PricingTier.Free ? 'border-primary-600 bg-primary-50 shadow-md ring-1 ring-primary-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                  <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${newProject.tier === PricingTier.Free ? 'text-primary-900' : 'text-slate-900'}`}>Free</span>
                      {newProject.tier === PricingTier.Free && <Icons.Check className="w-4 h-4 text-primary-600" />}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">$0</div>
                  <div className="text-xs text-slate-500">Growth & Leads</div>
              </div>

              {/* Standard Tier (Coming Soon) */}
              <div className="rounded-xl p-4 border-2 border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">COMING SOON</div>
                  <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-500">Standard</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-400 mb-1">$9.90</div>
                  <div className="text-xs text-slate-400">Most Popular</div>
              </div>

              {/* Premium Tier (Coming Soon) */}
              <div className="rounded-xl p-4 border-2 border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">COMING SOON</div>
                  <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-500">Premium</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-400 mb-1">$19.90</div>
                  <div className="text-xs text-slate-400">Full Suite</div>
              </div>
              </div>
          </div>
      )}

      {createStep === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check className="w-8 h-8 text-green-600" /></div>
             <h2 className="text-2xl font-bold text-slate-900">Ready to Launch?</h2>
             <p className="text-slate-500">Review your project details before publishing.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
             <div className="p-4 flex justify-between"><span className="text-slate-500">Project Name</span><span className="font-medium text-slate-900">{newProject.name || 'Untitled'}</span></div>
             <div className="p-4 flex justify-between"><span className="text-slate-500">App Type</span><span className="font-medium text-slate-900 capitalize">{newProject.appType} App</span></div>
             <div className="p-4 flex justify-between"><span className="text-slate-500">Pricing Tier</span><span className="font-medium text-slate-900 capitalize">{newProject.tier.replace(/_/g, ' ')}</span></div>
             <div className="p-4 flex justify-between"><span className="text-slate-500">Features</span><span className="font-medium text-slate-900">{newProject.features.length} Blocks</span></div>
          </div>
          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 mt-6">
             <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
             <div className="text-sm"><span className="font-bold text-slate-900">I agree to the Developer Terms</span></div>
          </label>
        </div>
      )}

      {/* Step 4: Success */}
      {createStep === 4 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 py-12">
              <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30">
                      <Icons.Check className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-4">You're Live!</h2>
                  <p className="text-lg text-slate-500 max-w-lg mx-auto mb-8">
                      <strong>{newProject.name}</strong> has been successfully published to the marketplace. 
                      You can now track sales and manage your listing from the dashboard.
                  </p>
                  <Button size="lg" onClick={() => setActiveTab('overview')} className="px-8">
                      Go to Dashboard
                  </Button>
              </div>
          </div>
      )}

      {/* Footer Navigation (Hidden on Step 4) */}
      {createStep < 4 && (
        <div className="pt-8 border-t border-slate-100 flex justify-between mt-8">
            <div className="flex gap-2">
                {createStep > 1 ? (
                    <Button variant="outline" onClick={() => setCreateStep(prev => prev - 1)}>Back</Button>
                ) : (
                    <Button variant="outline" onClick={() => setActiveTab('overview')}>Cancel</Button>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSaveDraft} className="text-slate-500 hover:text-slate-900">Save as Draft</Button>
                {createStep < 3 ? (
                    <Button onClick={() => setCreateStep(prev => prev + 1)}>Next</Button>
                ) : (
                    <Button disabled={!agreedToTerms} onClick={handleCreateProject}>Create Project</Button>
                )}
            </div>
        </div>
      )}
    </div>
  );

  const renderPayoutSettings = () => (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
        <ComingSoon 
            title="Payout Settings" 
            description="We are currently upgrading our payout infrastructure to support global withdrawals. This feature will be available in the next update."
        />
      </div>
  );

  // --- Render Developer Settings ---
  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold text-slate-900">Developer Settings</h2>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-1">Profile Information</h3>
               <p className="text-sm text-slate-500">Update your public developer profile details.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Developer / Company Name</label>
                   <input type="text" defaultValue="PixelLabs" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                   <input type="email" defaultValue="support@pixellabs.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio / Description</label>
                <textarea rows={3} defaultValue="We build high-quality AI tools for creators." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
             </div>

             <div className="pt-4 flex justify-end">
                <Button>Save Profile</Button>
             </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
             <div>
               <h3 className="text-lg font-bold text-slate-900 mb-1">Security</h3>
               <p className="text-sm text-slate-500">Manage your password and authentication.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                   <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                   <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
             </div>
              <div className="pt-4 flex justify-end">
                <Button variant="outline">Update Password</Button>
             </div>
        </div>
    </div>
  );

  // --- Render Financials (Global Revenue) ---
  const renderFinancials = () => {
    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('overview')}>
                        <Icons.ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-900">Financial Performance</h1>
                </div>
            </div>
            <ComingSoon 
                title="Advanced Analytics" 
                description="Deep insights into your revenue, sales trends, and customer retention are being built. Stay tuned."
            />
        </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveTab('financials')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md hover:border-primary-200 transition-all group"
        >
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icons.ExternalLink className="w-4 h-4 text-primary-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Total Revenue</span>
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Icons.CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center">
            Click to view breakdown
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Active Licenses</span>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Icons.Shield className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalSales.toLocaleString()}</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Your Projects</h3>
          <Button size="sm" onClick={() => { setActiveTab('new-project'); setCreateStep(1); }}>
             <Icons.Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="text-slate-500 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 cursor-pointer transition-colors" onClick={() => setViewingProject(project)}>
                  <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${project.status === 'active' ? 'bg-green-100 text-green-700' : project.status === 'draft' ? 'bg-slate-200 text-slate-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">${project.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Sidebar Layout */}
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="font-bold text-slate-900">Developer Console</div>
              <div className="text-xs text-slate-500">PixelLabs Inc.</div>
            </div>
            <nav className="p-2 space-y-1">
              <button
                  onClick={() => { setActiveTab('overview'); setViewingProject(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.Dashboard className="w-4 h-4 mr-3" /> Overview
              </button>
              <button
                  onClick={() => { setActiveTab('new-project'); setCreateStep(1); setViewingProject(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'new-project' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.Plus className="w-4 h-4 mr-3" /> Create Project
              </button>
              <button
                  onClick={() => { setActiveTab('financials'); setViewingProject(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'financials' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.CreditCard className="w-4 h-4 mr-3" /> Financials
              </button>
              <button
                  onClick={() => { setActiveTab('payout-settings'); setViewingProject(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'payout-settings' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.Grip className="w-4 h-4 mr-3" /> Payout Method
              </button>
              <button
                  onClick={() => { setActiveTab('settings'); setViewingProject(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.Settings className="w-4 h-4 mr-3" /> Settings
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {viewingProject ? (
            <ProjectDetailView 
              project={viewingProject} 
              onBack={() => setViewingProject(null)} 
              onUpdate={handleUpdateProject} 
              licenses={licenses}
            />
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'new-project' && renderCreateWizard()}
              {activeTab === 'financials' && renderFinancials()}
              {activeTab === 'payout-settings' && renderPayoutSettings()}
              {activeTab === 'settings' && renderSettings()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
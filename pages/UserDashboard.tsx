import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { MOCK_PROJECTS } from '../services/mockData';
import { License, Project } from '../types';

interface UserDashboardProps {
  onProductClick: (project: Project) => void;
  licenses: License[];
  onRefund: (licenseId: string) => void;
  userRole: 'buyer' | 'developer' | 'admin' | null;
  onBecomeDeveloper: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onProductClick, licenses, onRefund, userRole, onBecomeDeveloper }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'billing' | 'settings'>('library');
  
  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState<Project | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedLicenseForRefund, setSelectedLicenseForRefund] = useState<License | null>(null);

  // Developer Activation Modal
  const [showDevModal, setShowDevModal] = useState(false);

  // Simulate logged-in user data
  const userEmail = "demo@user.com";
  
  const getProjectDetails = (projectId: string) => {
    return MOCK_PROJECTS.find(p => p.id === projectId);
  };

  // --- Refund Logic ---
  const calculateRefundDeadline = (paymentDateStr: string) => {
    const paymentDate = new Date(paymentDateStr);
    const deadline = new Date(paymentDate);
    deadline.setDate(deadline.getDate() + 14); // Add 14 days
    return deadline;
  };

  const isWithinRefundWindow = (paymentDateStr: string) => {
    const deadline = calculateRefundDeadline(paymentDateStr);
    const today = new Date();
    return today <= deadline;
  };

  const hasPreviousRefundForProject = (projectId: string) => {
    // Check if user has ANY refunded license for this specific project ID
    return licenses.some(l => l.projectId === projectId && l.status === 'refunded');
  };

  const initiateRefundRequest = (license: License) => {
      // Check for double refund abuse
      if (hasPreviousRefundForProject(license.projectId)) {
          alert("Refund not allowed: You have previously refunded this product. To prevent abuse, products can only be refunded once per account.");
          return;
      }
      setSelectedLicenseForRefund(license);
      setShowRefundModal(true);
  };

  const confirmRefund = () => {
      if (selectedLicenseForRefund) {
          onRefund(selectedLicenseForRefund.id);
          setShowRefundModal(false);
          setSelectedLicenseForRefund(null);
          // Small delay to allow UI to update then alert
          setTimeout(() => alert("Refund processed successfully. Access has been revoked."), 100);
      }
  };

  // --- End Refund Logic ---

  const generateReceipt = (license: License) => {
    const date = new Date(license.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt - #${license.id}</title>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 50px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .company-info { text-align: right; font-size: 14px; color: #666; }
            .bill-to { margin-bottom: 40px; }
            .bill-to h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #888; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { text-align: left; padding: 15px 0; border-bottom: 2px solid #333; }
            .table td { padding: 15px 0; border-bottom: 1px solid #eee; }
            .total { text-align: right; font-size: 20px; font-weight: bold; }
            .footer { margin-top: 60px; font-size: 12px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DeFiner Technology Limited</div>
            <div class="company-info">
              123 Innovation Drive<br>
              Tech City, TC 94000<br>
              support@definer.tech
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between;">
             <div class="bill-to">
                <h3>Bill To</h3>
                <strong>Demo User</strong><br>
                ${userEmail}
             </div>
             <div class="bill-to" style="text-align: right;">
                <h3>Receipt Details</h3>
                <strong>Date:</strong> ${date}<br>
                <strong>Receipt #:</strong> ${license.id}<br>
                <strong>Payment Method:</strong> Visa ending 4242
             </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Type</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${license.projectName}</strong><br>
                  <span style="font-size: 12px; color: #666;">License Key: ${license.key}</span>
                </td>
                <td>Lifetime License</td>
                <td style="text-align: right;">$${license.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total Paid: $${license.amount.toFixed(2)}
          </div>

          <div class="footer">
            Thank you for your purchase.<br>
            DeFiner Technology Limited • Registration #882291
          </div>
          <script>
             window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const win = window.open('', '', 'height=700,width=900');
    if (win) {
        win.document.write(receiptHTML);
        win.document.close();
    }
  };

  const handleOpenFeedback = (project: Project) => {
    setSelectedProjectForFeedback(project);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedProjectForFeedback) return;
    setTimeout(() => {
        alert(`Feedback sent to ${selectedProjectForFeedback.developerName}. They have been notified via email.`);
        setFeedbackText('');
        setShowFeedbackModal(false);
    }, 500);
  };

  const handleLaunchApp = (project: Project) => {
    const url = project.appUrl || '#';
    
    if (project.appType === 'desktop') {
        if (window.confirm(`Do you want to download ${project.name}?`)) {
            // In a real app, this would trigger a file download
            window.open(url, '_blank');
        }
    } else {
        // Web or Mobile (Web link)
        window.open(url, '_blank');
    }
  };

  const handleDeveloperAction = () => {
    if (userRole === 'developer') {
        onBecomeDeveloper(); // Navigates to dashboard
    } else {
        setShowDevModal(true);
    }
  };

  const confirmBecomeDeveloper = () => {
    setShowDevModal(false);
    onBecomeDeveloper();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
      {/* Feedback Modal */}
      {showFeedbackModal && selectedProjectForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Report Issue / Feedback</h3>
                    <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={selectedProjectForFeedback.images[0]} className="w-10 h-10 rounded object-cover" alt="" />
                        <div>
                            <div className="font-bold text-slate-900">{selectedProjectForFeedback.name}</div>
                            <div className="text-xs text-slate-500">Developer: {selectedProjectForFeedback.developerName}</div>
                        </div>
                    </div>
                    
                    <label className="block text-sm font-medium text-slate-700 mb-2">Describe your issue or suggestion</label>
                    <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        rows={5}
                        placeholder="I found a bug when trying to..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-slate-400 mt-2">
                        The developer will be notified via email immediately.
                    </p>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                    <Button variant="ghost" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
                    <Button onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>Send Feedback</Button>
                </div>
            </div>
        </div>
      )}

      {/* Become Developer Confirmation Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icons.Code2 className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Become a Creator</h3>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        Start selling your own AI tools on DeveHub. Join thousands of developers earning recurring revenue.
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-600 mb-6 space-y-2 border border-slate-100">
                        <div className="flex items-center gap-2">
                            <Icons.Check className="w-4 h-4 text-green-500" /> <span>Keep 90% of revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.Check className="w-4 h-4 text-green-500" /> <span>Instant payouts via Stripe</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.Check className="w-4 h-4 text-green-500" /> <span>Ownership of your IP</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowDevModal(false)}>Maybe Later</Button>
                        <Button className="flex-1" onClick={confirmBecomeDeveloper}>Activate Console</Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundModal && selectedLicenseForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.ArrowRight className="w-6 h-6 text-red-600 rotate-180" /> {/* Mimic return icon */}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Request Refund?</h3>
                    <p className="text-sm text-slate-500 text-center mb-4">
                        Are you sure you want to return <strong>{selectedLicenseForRefund.projectName}</strong>? 
                        Your license key will be immediately revoked.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 mb-6">
                        <div className="flex justify-between mb-1">
                            <span>Purchase Date:</span>
                            <span className="font-medium">{selectedLicenseForRefund.paymentDate}</span>
                        </div>
                        <div className="flex justify-between text-red-600 font-bold">
                            <span>Refund Deadline:</span>
                            <span>{calculateRefundDeadline(selectedLicenseForRefund.paymentDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowRefundModal(false)}>Cancel</Button>
                        <Button className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={confirmRefund}>Confirm Refund</Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-6 bg-slate-50 border-b border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-sm">
                 <span className="text-2xl font-bold text-purple-600">D</span>
              </div>
              <div className="font-bold text-slate-900">Demo User</div>
              <div className="text-xs text-slate-500">{userEmail}</div>
            </div>
            <nav className="p-2 space-y-1">
              <button
                  onClick={() => setActiveTab('library')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'library' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.ShoppingBag className="w-4 h-4 mr-3" /> My Apps
              </button>
              <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.CreditCard className="w-4 h-4 mr-3" /> Billing History
              </button>
              <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icons.Settings className="w-4 h-4 mr-3" /> Settings
              </button>
              
              <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={handleDeveloperAction}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                  >
                      <Icons.Code2 className="w-4 h-4 mr-3" /> 
                      {userRole === 'developer' ? 'Developer Console' : 'Sell Your Apps'}
                  </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          
          {/* TAB: MY LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold text-slate-900">My App Library</h2>
                 <Button variant="outline" size="sm">
                   <Icons.Refresh className="w-4 h-4 mr-2" /> Check for Updates
                 </Button>
               </div>

               {licenses.filter(l => l.status === 'active').length > 0 ? (
                 <div className="grid grid-cols-1 gap-6">
                   {licenses.filter(l => l.status === 'active').map((license) => {
                     const project = getProjectDetails(license.projectId);
                     if (!project) return null;
                     
                     return (
                       <div key={license.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:border-primary-200 transition-colors">
                          {/* App Image - Clickable to go to Details */}
                          <div 
                            onClick={() => onProductClick(project)}
                            className="w-full md:w-48 h-32 md:h-auto bg-slate-100 relative cursor-pointer group"
                          >
                             <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">View Details</span>
                             </div>
                          </div>
                          
                          {/* Details */}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h3 
                                     onClick={() => onProductClick(project)}
                                     className="text-xl font-bold text-slate-900 cursor-pointer hover:text-primary-600 transition-colors"
                                   >
                                     {project.name}
                                   </h3>
                                   <p className="text-sm text-slate-500 mt-1 line-clamp-1">{project.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    Lifetime License
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                        {project.appType ? `${project.appType} App` : 'Web App'}
                                    </span>
                                </div>
                             </div>

                             <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">License Key</p>
                                <div className="flex items-center gap-2">
                                   <code className="flex-1 font-mono text-sm bg-white px-3 py-2 rounded border border-slate-200 text-slate-700 select-all">
                                      {license.key}
                                   </code>
                                   <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(license.key)}>
                                      <Icons.Copy className="w-4 h-4" />
                                   </Button>
                                </div>
                             </div>

                             <div className="mt-4 flex flex-wrap gap-3">
                                {project.appType === 'desktop' ? (
                                    <Button size="sm" variant="primary" onClick={() => handleLaunchApp(project)}>
                                        <Icons.ArrowDown className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="primary" onClick={() => handleLaunchApp(project)}>
                                        <Icons.ExternalLink className="w-4 h-4 mr-2" /> Launch App
                                    </Button>
                                )}
                                <Button size="sm" variant="outline" onClick={() => window.open('#', '_blank')}>View Docs</Button>
                                <Button size="sm" variant="ghost" onClick={() => handleOpenFeedback(project)} className="text-slate-500 hover:text-red-600">
                                    <Icons.Terminal className="w-4 h-4 mr-2" /> Report Issue
                                </Button>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <Icons.ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No active apps</h3>
                    <p className="text-slate-500 mb-6">Explore the marketplace to find tools that boost your workflow.</p>
                    <Button>Browse Marketplace</Button>
                 </div>
               )}
            </div>
          )}

          {/* TAB: BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-bold text-slate-900">Billing History</h2>
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4 font-medium">Date</th>
                           <th className="px-6 py-4 font-medium">Item</th>
                           <th className="px-6 py-4 font-medium">License ID</th>
                           <th className="px-6 py-4 font-medium text-right">Amount</th>
                           <th className="px-6 py-4 font-medium text-center">Status</th>
                           <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {licenses.map(lic => {
                           const canRefund = isWithinRefundWindow(lic.paymentDate);
                           return (
                           <tr key={lic.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-slate-600">{lic.paymentDate}</td>
                              <td className="px-6 py-4 font-medium text-slate-900">{lic.projectName}</td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">{lic.id}</td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">${lic.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 text-center">
                                  {lic.status === 'active' ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Success
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          Refunded
                                      </span>
                                  )}
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                 {lic.status === 'active' && canRefund && (
                                     <button 
                                        onClick={() => initiateRefundRequest(lic)}
                                        className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                     >
                                        Refund
                                     </button>
                                 )}
                                 <button 
                                   onClick={() => generateReceipt(lic)}
                                   className="text-primary-600 hover:text-primary-800 text-xs font-medium border border-primary-200 px-3 py-1 rounded hover:bg-primary-50 transition-colors"
                                 >
                                   Receipt
                                 </button>
                              </td>
                           </tr>
                        )})}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h2>
                  <p className="text-slate-500">Manage your profile and security preferences.</p>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                     <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500">
                        D
                     </div>
                     <div>
                        <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                        <p className="text-xs text-slate-400">JPG or PNG. Max 1MB.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input type="text" defaultValue="Demo User" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input type="email" defaultValue={userEmail} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-slate-50" disabled />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                     <input type="password" placeholder="Leave blank to keep current" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>

                  <div className="pt-4 flex justify-end">
                     <Button>Save Changes</Button>
                  </div>
               </div>

               <div className="bg-red-50 rounded-xl border border-red-100 p-6 flex items-center justify-between">
                  <div>
                     <h4 className="font-bold text-red-900">Delete Account</h4>
                     <p className="text-sm text-red-700 mt-1">Permanently remove your account and all data. Licenses will be lost.</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300">Delete</Button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
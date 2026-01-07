import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { MOCK_PROJECTS, MOCK_USERS } from '../services/mockData';
import { Project, License, User } from '../types';

interface AdminDashboardProps {
    onImpersonate?: (role: 'buyer' | 'developer') => void;
    licenses?: License[];
    onRefund?: (licenseId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onImpersonate, licenses = [], onRefund }) => {
    const [activeTab, setActiveTab] = useState<'apps' | 'financials' | 'users'>('apps');
    const [projects, setProjects] = useState(MOCK_PROJECTS.sort((a, b) => a.ranking - b.ranking));
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals State
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedProjectForSettings, setSelectedProjectForSettings] = useState<Project | null>(null);

    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedLicenseForRefund, setSelectedLicenseForRefund] = useState<License | null>(null);

    // --- Logic for Apps ---
    const handleStatusChange = (id: string, newStatus: Project['status']) => {
        setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    const moveRank = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === projects.length - 1) return;

        const newProjects = [...projects];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

        // Update ranking numbers
        const updated = newProjects.map((p, i) => ({ ...p, ranking: i + 1 }));
        setProjects(updated);
    };

    const openAppSettings = (project: Project) => {
        setSelectedProjectForSettings(project);
        setShowSettingsModal(true);
    };

    const saveAppSettings = () => {
        // Mock saving logic
        setShowSettingsModal(false);
        alert(`Settings saved for ${selectedProjectForSettings?.name}`);
    };

    // --- Logic for Users (Auto-deletion) ---
    const handleDeleteUser = (userId: string) => {
        if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const checkUserDeletable = (user: User) => {
        const today = new Date();
        const lastLoginDate = new Date(user.lastLogin);
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

        const isInactive = lastLoginDate < sixMonthsAgo;
        const hasAssets = user.hasPurchases || user.hasUploads;

        return isInactive && !hasAssets;
    };

    // --- Logic for Financials ---
    const getPendingPayouts = () => {
        const pendingByDev: Record<string, number> = {};
        licenses.forEach(lic => {
            // Only count if not refunded
            if (lic.status !== 'refunded' && (lic.payoutStatus === 'pending' || lic.payoutStatus === 'ready')) {
                const devName = projects.find(p => p.id === lic.projectId)?.developerName || 'Unknown';
                if (!pendingByDev[devName]) pendingByDev[devName] = 0;
                pendingByDev[devName] += (lic.amount * 0.9); // 90% share
            }
        });
        return Object.entries(pendingByDev).map(([name, amount]) => ({ name, amount }));
    };

    const initiateAdminRefund = (license: License) => {
        setSelectedLicenseForRefund(license);
        setShowRefundModal(true);
    };

    const confirmAdminRefund = () => {
        if (!selectedLicenseForRefund || !onRefund) return;

        onRefund(selectedLicenseForRefund.id);
        setShowRefundModal(false);
        setSelectedLicenseForRefund(null);
        // Feedback is handled by the UI updating the status, but we can add an alert or toast here if needed
    };

    const pendingPayouts = getPendingPayouts();
    const totalPending = pendingPayouts.reduce((sum, item) => sum + item.amount, 0);

    // Calculate Gross: Active Sales - Refunds (Implied)
    // Logic: Sum of all Active amounts MINUS refund amounts
    const activeRevenue = licenses.reduce((sum, l) => l.status === 'active' ? sum + l.amount : sum, 0);
    const refundedAmount = licenses.reduce((sum, l) => l.status === 'refunded' ? sum + l.amount : sum, 0);
    const totalGross = activeRevenue; // Display Active Revenue as Gross for now, or could be (activeRevenue + refundedAmount) - refundedAmount

    const totalRefundedCount = licenses.filter(l => l.status === 'refunded').length;

    // --- Filtered Views ---
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            {/* --- MODALS --- */}

            {/* App Settings Modal */}
            {showSettingsModal && selectedProjectForSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">App Configuration</h3>
                            <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600">
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <img src={selectedProjectForSettings.images[0]} className="w-16 h-12 object-cover rounded-lg bg-slate-200" alt="" />
                                <div>
                                    <h4 className="font-bold text-slate-900">{selectedProjectForSettings.name}</h4>
                                    <p className="text-sm text-slate-500">{selectedProjectForSettings.developerName}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                    <div>
                                        <div className="font-medium text-slate-900">Featured Placement</div>
                                        <div className="text-xs text-slate-500">Boost this app to the homepage carousel.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                    <div>
                                        <div className="font-medium text-slate-900">Verified Badge</div>
                                        <div className="text-xs text-slate-500">Mark this developer/app as trusted.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                                    <div>
                                        <div className="font-medium text-red-900">Suspend Sales</div>
                                        <div className="text-xs text-red-700">Temporarily prevent new purchases.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                            <Button onClick={saveAppSettings}>Save Configuration</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Force Refund Confirmation Modal */}
            {showRefundModal && selectedLicenseForRefund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icons.AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Forced Refund</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Are you sure you want to refund <strong>{selectedLicenseForRefund.projectName}</strong> for <strong>{selectedLicenseForRefund.customerEmail}</strong>?
                                <br /><br />
                                <span className="font-medium text-slate-700">Funds will be returned to the customer's original payment method in approximately 3 business days.</span>
                                <br />
                                <span className="text-xs text-red-500 mt-2 block">This action is irreversible.</span>
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowRefundModal(false)}>Cancel</Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={confirmAdminRefund}>Process Refund</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Administration</h1>
                    <p className="text-slate-500">Manage apps, approvals, and financials.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-700">System Healthy</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit mb-8">
                <button
                    onClick={() => setActiveTab('apps')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'apps' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    App Rankings & Reviews
                </button>
                <button
                    onClick={() => setActiveTab('financials')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'financials' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Financial Control Center
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    User Lifecycle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Stats */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Total Revenue (Net)</div>
                        <div className="text-2xl font-bold text-slate-900">${totalGross.toFixed(2)}</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Pending Payouts</div>
                        <div className="text-2xl font-bold text-slate-900">${totalPending.toFixed(2)}</div>
                        <p className="text-xs text-slate-400 mt-1">Due next cycle</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Total Users</div>
                        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">

                    {/* TAB: APPS */}
                    {activeTab === 'apps' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">App Rankings</h3>
                                <span className="text-xs text-slate-500">Drag & Drop Simulation</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 w-16 text-center">Rank</th>
                                            <th className="px-4 py-3">Application</th>
                                            <th className="px-4 py-3">Developer</th>
                                            <th className="px-4 py-3">Consultation</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {projects.map((project, index) => (
                                            <tr key={project.id} className="hover:bg-slate-50 group">
                                                <td className="px-4 py-3 text-center font-mono text-slate-400">
                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                        <button onClick={() => moveRank(index, 'up')} className="hover:text-primary-600 disabled:opacity-30" disabled={index === 0}>
                                                            <Icons.ArrowUp className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-bold text-slate-700">{index + 1}</span>
                                                        <button onClick={() => moveRank(index, 'down')} className="hover:text-primary-600 disabled:opacity-30" disabled={index === projects.length - 1}>
                                                            <Icons.ArrowDown className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={project.images[0]} className="w-10 h-8 object-cover rounded bg-slate-200" alt="" />
                                                        <span className="font-medium text-slate-900">{project.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{project.developerName}</td>
                                                <td className="px-4 py-3">
                                                    {project.isConsultationRequested ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                            Requested
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={project.status}
                                                        onChange={(e) => handleStatusChange(project.id, e.target.value as any)}
                                                        className={`text-xs font-bold uppercase rounded border-0 bg-transparent py-1 pl-0 pr-6 focus:ring-0 ${project.status === 'active' ? 'text-green-600' :
                                                                project.status === 'review' ? 'text-amber-600' : 'text-slate-500'
                                                            }`}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="review">Review</option>
                                                        <option value="draft">Draft</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => openAppSettings(project)}
                                                        >
                                                            <Icons.Settings className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: FINANCIALS */}
                    {activeTab === 'financials' && (
                        <div className="space-y-8 animate-in fade-in">

                            {/* Finance Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Total Refunded</p>
                                        <h3 className="text-2xl font-bold text-red-600">${refundedAmount.toFixed(2)}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{totalRefundedCount} transactions</p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-full">
                                        <Icons.ArrowDown className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Platform Fees</p>
                                        <h3 className="text-2xl font-bold text-indigo-600">${(totalGross * 0.1).toFixed(2)}</h3>
                                        <p className="text-xs text-slate-400 mt-1">10% of gross volume</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-full">
                                        <Icons.CreditCard className="w-6 h-6 text-indigo-500" />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Active Licenses</p>
                                        <h3 className="text-2xl font-bold text-green-600">{licenses.filter(l => l.status === 'active').length}</h3>
                                        <p className="text-xs text-slate-400 mt-1">Across all projects</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <Icons.Check className="w-6 h-6 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Master Transaction Log */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Master Transaction Log</h3>
                                    <Button size="sm" variant="outline">Export CSV</Button>
                                </div>
                                <div className="max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-slate-500 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                                <th className="px-6 py-3 font-medium">Transaction ID</th>
                                                <th className="px-6 py-3 font-medium">Customer</th>
                                                <th className="px-6 py-3 font-medium">Project</th>
                                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                                                <th className="px-6 py-3 font-medium text-right">Status</th>
                                                <th className="px-6 py-3 font-medium text-right">Admin Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {licenses.map(lic => (
                                                <tr key={lic.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-3 text-slate-600 text-xs whitespace-nowrap">{lic.paymentDate}</td>
                                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{lic.id}</td>
                                                    <td className="px-6 py-3 text-slate-600 text-xs">{lic.customerEmail}</td>
                                                    <td className="px-6 py-3 text-slate-900 text-xs font-medium">{lic.projectName}</td>
                                                    <td className="px-6 py-3 text-right font-medium">
                                                        {lic.status === 'refunded' ? (
                                                            <span className="text-red-600">- ${lic.amount.toFixed(2)}</span>
                                                        ) : (
                                                            <span>${lic.amount.toFixed(2)}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${lic.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {lic.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        {lic.status === 'active' && (
                                                            <button
                                                                onClick={() => initiateAdminRefund(lic)}
                                                                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Force Refund
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pending Payout Queue */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                    <h3 className="font-bold text-slate-900">Developer Payout Queue</h3>
                                    <p className="text-xs text-slate-500">Amounts cleared for next payout cycle (14th/28th)</p>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Developer</th>
                                            <th className="px-6 py-3 font-medium">Method</th>
                                            <th className="px-6 py-3 font-medium text-right">Amount Due</th>
                                            <th className="px-6 py-3 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pendingPayouts.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        {Math.random() > 0.5 ? <Icons.CreditCard className="w-4 h-4" /> : <span className="font-bold italic text-blue-700 text-xs">Pay</span>}
                                                        <span className="text-xs">{Math.random() > 0.5 ? 'Stripe Connect' : 'PayPal'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-700">
                                                    ${item.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button size="sm" variant="outline">Process</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pendingPayouts.length === 0 && (
                                            <tr><td colSpan={4} className="p-6 text-center text-slate-400">No pending payouts.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                    {/* TAB: USERS (LIFECYCLE) */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-900">User Lifecycle Management</h3>
                                    <p className="text-xs text-slate-500">Auto-delete triggers for inactive accounts (6mo) without assets.</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="text-sm border border-slate-300 rounded px-2 py-1"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">User Details</th>
                                            <th className="px-6 py-3 font-medium">Last Active</th>
                                            <th className="px-6 py-3 font-medium">Assets</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium text-right">Lifecycle Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map(user => {
                                            const deletable = checkUserDeletable(user);
                                            return (
                                                <tr key={user.id} className={`hover:bg-slate-50 ${deletable ? 'bg-red-50/30' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{user.name}</div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                        <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {user.lastLogin}
                                                        {deletable && <span className="block text-[10px] text-red-500 font-bold">Inactive {'>'} 6mo</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span className={user.hasPurchases ? "text-green-600 font-medium" : "text-slate-400"}>
                                                                {user.hasPurchases ? "Has Purchases" : "No Purchases"}
                                                            </span>
                                                            <span className={user.hasUploads ? "text-blue-600 font-medium" : "text-slate-400"}>
                                                                {user.hasUploads ? "Has Uploads" : "No Uploads"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {deletable ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-700 animate-pulse">
                                                                Ready to Purge
                                                            </span>
                                                        ) : (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                {user.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {onImpersonate && user.status === 'active' && (
                                                                <Button size="sm" variant="outline" onClick={() => onImpersonate(user.role as 'buyer' | 'developer')}>
                                                                    Login As
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                disabled={!deletable}
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className={deletable ? "text-white bg-red-600 hover:bg-red-700 hover:text-white" : "text-slate-300 cursor-not-allowed"}
                                                            >
                                                                {deletable ? "Delete Account" : "Cannot Delete"}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

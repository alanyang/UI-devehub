import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icons } from './components/Icons';
import { Button } from './components/Button';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Marketplace } from './pages/Marketplace';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { ProductDetail } from './pages/ProductDetail';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { Login } from './pages/Login';
import { BuildService } from './pages/BuildService';
import { Project, ViewState, License, PricingTier } from './types';
import { MOCK_LICENSES } from './services/mockData';

// Simple Hash Router Implementation
const App: React.FC = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewState | 'build-service'>('marketplace');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<'buyer' | 'developer' | 'admin' | null>(null);

  // Lifted State for Licenses to sync between User refund and Developer dashboard
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);

  // Handle Hash Changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // remove #
      if (hash === 'dashboard') setCurrentView('dashboard');
      else if (hash === 'admin-dashboard') setCurrentView('admin-dashboard');
      else if (hash === 'user-dashboard') setCurrentView('user-dashboard');
      else if (hash === 'login') setCurrentView('login');
      else if (hash === 'build-service') setCurrentView('build-service');
      else if (hash === 'marketplace' || hash === '') setCurrentView('marketplace');
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: ViewState | 'build-service') => {
    window.location.hash = view === 'marketplace' ? '' : view;
    setCurrentView(view);
  };

  const handleProductClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('product-detail');
    window.scrollTo(0, 0);
  };

  const handlePurchaseSuccess = (project: Project) => {
    const today = new Date();
    const payoutDate = new Date(today);
    payoutDate.setDate(today.getDate() + 60);

    const newLicense: License = {
      id: `lic_${Date.now()}`,
      key: `DH-${Math.floor(Math.random() * 10000)}-${project.name.substring(0, 3).toUpperCase()}-LIFE`,
      projectId: project.id,
      projectName: project.name,
      amount: project.pricingTier === PricingTier.Standard ? 9.90 : project.pricingTier === PricingTier.Premium ? 19.90 : 0,
      customerEmail: 'demo@user.com', // Current logged in user
      status: 'active',
      payoutStatus: 'pending',
      paymentDate: today.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }),
      expectedPayoutDate: payoutDate.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }),
    };

    setLicenses([newLicense, ...licenses]); // Add to top
    setSelectedProject(project);
    setCurrentView('checkout-success');
    window.scrollTo(0, 0);
  };

  const handleRefund = (licenseId: string) => {
    setLicenses(prevLicenses => prevLicenses.map(lic => {
      if (lic.id === licenseId) {
        return { ...lic, status: 'refunded', payoutStatus: 'cancelled' };
      }
      return lic;
    }));
  };

  const handleLoginSuccess = (role: 'buyer' | 'developer' | 'admin') => {
    setUserRole(role);
    if (role === 'developer') {
      navigateTo('dashboard');
    } else if (role === 'admin') {
      navigateTo('admin-dashboard');
    } else if (role === 'buyer') {
      navigateTo('user-dashboard');
    } else {
      // Fallback
      if (currentView === 'login') {
        navigateTo('marketplace');
      }
    }
  };

  // Admin Impersonation Logic
  const handleImpersonate = (role: 'buyer' | 'developer') => {
    setUserRole(role);
    if (role === 'developer') {
      navigateTo('dashboard');
    } else {
      navigateTo('user-dashboard');
    }
  };

  const handleBecomeDeveloper = () => {
    setUserRole('developer');
    navigateTo('dashboard');
  };

  const handleAvatarClick = () => {
    if (userRole === 'developer') {
      navigateTo('dashboard');
    } else if (userRole === 'admin') {
      navigateTo('admin-dashboard');
    } else if (userRole === 'buyer') {
      navigateTo('user-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    navigateTo('marketplace');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary-200 selection:text-primary-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo('marketplace')}
          >
            {/* Updated Logo: Solid Purple Brain with White Tree Cutout */}
            <div className="relative w-9 h-9 mr-2 flex items-center justify-center">
              <Icons.Brain className="w-9 h-9 text-purple-600 fill-purple-600" strokeWidth={0} />
              <Icons.Tree className="w-5 h-5 text-white absolute bottom-1.5" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight group-hover:opacity-80 transition-opacity">DeveHub</span>
          </div>

          <div className="flex items-center gap-4">
            {currentView === 'login' ? null : (
              <>
                {/* Navigation Links based on Role */}
                <button
                  onClick={() => navigateTo('build-service')}
                  className={`text-sm font-medium transition-colors hidden sm:block ${currentView === 'build-service' ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
                >
                  {t('nav.buildApp')}
                </button>

                {userRole === 'admin' ? (
                  <button
                    onClick={() => navigateTo('admin-dashboard')}
                    className={`text-sm font-medium transition-colors hidden sm:block ${currentView === 'admin-dashboard' ? 'text-red-600' : 'text-slate-500 hover:text-red-600'}`}
                  >
                    {t('nav.adminConsole')}
                  </button>
                ) : (
                  <>
                    {/* If developer, show Developer Dashboard Link */}
                    {userRole === 'developer' && (
                      <button
                        onClick={() => navigateTo('dashboard')}
                        className={`text-sm font-medium transition-colors hidden sm:block ${currentView === 'dashboard' ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
                      >
                        {t('nav.devDashboard')}
                      </button>
                    )}

                    {/* Users and Developers see "My Library" */}
                    {userRole && (
                      <button
                        onClick={() => navigateTo('user-dashboard')}
                        className={`text-sm font-medium transition-colors hidden sm:block ${currentView === 'user-dashboard' ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
                      >
                        {t('nav.myLibrary')}
                      </button>
                    )}
                  </>
                )}

                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {!userRole ? (
                  <Button size="sm" variant="secondary" onClick={() => navigateTo('login')} className="rounded-full px-6">
                    {t('nav.login')}
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick} title="Account">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shadow-sm ${userRole === 'developer'
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : userRole === 'admin'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}>
                        {userRole === 'developer' ? 'DV' : userRole === 'admin' ? 'AD' : 'US'}
                      </div>
                    </div>

                    {/* Logout Button */}
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-red-500 px-2">
                      <Icons.X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'marketplace' && (
          <Marketplace onProductClick={handleProductClick} />
        )}

        {currentView === 'build-service' && (
          <BuildService />
        )}

        {currentView === 'dashboard' && (
          <Dashboard licenses={licenses} />
        )}

        {currentView === 'user-dashboard' && (
          <UserDashboard
            licenses={licenses}
            onProductClick={handleProductClick}
            onRefund={handleRefund}
            userRole={userRole}
            onBecomeDeveloper={handleBecomeDeveloper}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            licenses={licenses}
            onImpersonate={handleImpersonate}
            onRefund={handleRefund}
          />
        )}

        {currentView === 'product-detail' && selectedProject && (
          <ProductDetail
            project={selectedProject}
            isLoggedIn={!!userRole}
            onLoginReq={() => navigateTo('login')}
            onBack={() => navigateTo('marketplace')}
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        )}

        {currentView === 'checkout-success' && selectedProject && (
          <CheckoutSuccess
            project={selectedProject}
            onGoHome={() => navigateTo('marketplace')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="relative w-6 h-6 mr-2 flex items-center justify-center">
                  <Icons.Brain className="w-6 h-6 text-purple-600 fill-purple-600" strokeWidth={0} />
                  <Icons.Tree className="w-5 h-5 text-white absolute bottom-1.5" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-slate-800">DeveHub</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The only marketplace where you buy tools once and own them forever. No more monthly fees.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.marketplace')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary-600">{t('footer.browseAll')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.newArrivals')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.featured')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.developers')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary-600">{t('footer.sellYourTool')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.developerApi')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.successStories')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary-600">{t('footer.termsOfService')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-primary-600">{t('footer.refundPolicy')}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>{t('footer.madeWithLove')} <span className="text-red-400">♥</span> for independent creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

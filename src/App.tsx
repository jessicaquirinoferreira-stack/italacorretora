import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { testConnection } from './lib/firebase';
import {
  getSiteSettings,
  getDevelopments,
  getLandingPages,
  getLeads,
  getLandingPageBySlug,
} from './lib/firestoreService';
import { Development, LandingPage, Lead, SiteSettings } from './types';
import { initialSiteSettings, initialDevelopments } from './lib/seedData';

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PropertySearch, SearchFilters } from './components/PropertySearch';
import { PropertyShowcase } from './components/PropertyShowcase';
import { AboutSection } from './components/AboutSection';
import { LeadForm } from './components/LeadForm';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { LandingPageViewer } from './components/LandingPageViewer';
import { CookieBanner } from './components/CookieBanner';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { FloatingSocialActions } from './components/FloatingSocialActions';
import { VirtualAssistant } from './components/VirtualAssistant';

// Admin Components
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminDevelopments } from './components/Admin/AdminDevelopments';
import { AdminLeads } from './components/Admin/AdminLeads';
import { AdminLandingPageGenerator } from './components/Admin/AdminLandingPageGenerator';
import { AdminSiteEditor } from './components/Admin/AdminSiteEditor';
import { AdminReports } from './components/Admin/AdminReports';

function MainApp() {
  const { isAdmin } = useAuth();

  // App Navigation View: 'home' | 'vitrine' | 'lancamentos' | 'property_detail' | 'landing_page' | 'admin_login' | 'admin'
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Preselected development for LP Generator
  const [preselectedLpDev, setPreselectedLpDev] = useState<Development | null>(null);

  // Data states
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [developments, setDevelopments] = useState<Development[]>(initialDevelopments);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Search Filters
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    city: '',
    propertyType: '',
    status: '',
    minPrice: 0,
    bedrooms: '',
  });

  // Initial load & URL routing check
  useEffect(() => {
    testConnection();
    loadAllData();

    // Check pathname or hash for deep linking
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/admin/login' || hash === '#/admin/login') {
        setCurrentView('admin_login');
      } else if (path.startsWith('/empreendimento/') || hash.startsWith('#/empreendimento/')) {
        const slug = path.startsWith('/empreendimento/')
          ? path.replace('/empreendimento/', '')
          : hash.replace('#/empreendimento/', '');
        if (slug) {
          setActiveSlug(slug);
          setCurrentView('property_detail');
        }
      } else if (path.startsWith('/lancamento/') || hash.startsWith('#/lancamento/')) {
        const slug = path.startsWith('/lancamento/')
          ? path.replace('/lancamento/', '')
          : hash.replace('#/lancamento/', '');
        if (slug) {
          setActiveSlug(slug);
          setCurrentView('landing_page');
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedSettings, fetchedDevs, fetchedLps, fetchedLeads] = await Promise.all([
        getSiteSettings(),
        getDevelopments(false),
        getLandingPages(),
        getLeads(),
      ]);

      setSettings(fetchedSettings);
      setDevelopments(fetchedDevs);
      setLandingPages(fetchedLps);
      setLeads(fetchedLeads);
    } catch (err) {
      console.warn('Data fetching completed with fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    if (param) setActiveSlug(param);

    if (view === 'home') {
      window.history.pushState({}, '', '/');
    } else if (view === 'property_detail' && param) {
      window.history.pushState({}, '', `/empreendimento/${param}`);
    } else if (view === 'landing_page' && param) {
      window.history.pushState({}, '', `/lancamento/${param}`);
    } else if (view === 'admin_login') {
      window.history.pushState({}, '', '/admin/login');
    }
  };

  // Filtered developments logic
  const filteredDevelopments = developments.filter((dev) => {
    if (!dev.published && !isAdmin) return false;

    // View specific filter
    if (currentView === 'lancamentos' && dev.status !== 'lancamento') {
      return false;
    }

    if (
      searchFilters.keyword &&
      !dev.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) &&
      !dev.neighborhood.toLowerCase().includes(searchFilters.keyword.toLowerCase()) &&
      !dev.city.toLowerCase().includes(searchFilters.keyword.toLowerCase())
    ) {
      return false;
    }

    if (searchFilters.city && dev.city !== searchFilters.city) {
      return false;
    }

    if (searchFilters.propertyType && dev.propertyType !== searchFilters.propertyType) {
      return false;
    }

    if (searchFilters.status && dev.status !== searchFilters.status) {
      return false;
    }

    if (searchFilters.bedrooms && dev.bedrooms < Number(searchFilters.bedrooms)) {
      return false;
    }

    return true;
  });

  const availableCities = Array.from(new Set(developments.map((d) => d.city))).filter(Boolean);

  // Active development for detail page
  const selectedDevelopment =
    developments.find((d) => d.slug === activeSlug) ||
    developments.find((d) => d.id === activeSlug) ||
    developments[0];

  // Active landing page
  const selectedLandingPage =
    landingPages.find((lp) => lp.slug === activeSlug) || landingPages[0];

  const newLeadsCount = leads.filter((l) => l.status === 'novo').length;

  /* RENDER 1: Dedicated Public Landing Page */
  if (currentView === 'landing_page' && selectedLandingPage) {
    const linkedDev = developments.find((d) => d.id === selectedLandingPage.developmentId);
    return (
      <div className="relative">
        <LandingPageViewer
          landingPage={selectedLandingPage}
          development={linkedDev}
          settings={settings}
          onNavigateHome={() => handleNavigate('home')}
        />
        <VirtualAssistant
          settings={settings}
          developments={developments}
          onNavigateToProperty={(slug) => handleNavigate('property_detail', slug)}
          onExploreVitrine={() => handleNavigate('home')}
        />
        <FloatingSocialActions settings={settings} />
      </div>
    );
  }

  /* RENDER 2: Admin Login */
  if (currentView === 'admin_login') {
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      return (
        <AdminLogin
          onBackToSite={() => handleNavigate('home')}
          onSuccess={() => setCurrentView('admin')}
        />
      );
    }
  }

  /* RENDER 3: Admin Protected Area */
  if (currentView === 'admin' && isAdmin) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => setAdminTab(tab)}
        onViewSite={() => handleNavigate('home')}
        settings={settings}
        newLeadsCount={newLeadsCount}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            developments={developments}
            leads={leads}
            landingPages={landingPages}
            settings={settings}
            onNavigateTab={(tab) => setAdminTab(tab)}
            onOpenLead={(lead) => {
              setAdminTab('leads');
            }}
          />
        )}
        {adminTab === 'developments' && (
          <AdminDevelopments
            developments={developments}
            onRefresh={loadAllData}
            onViewPublic={(slug) => handleNavigate('property_detail', slug)}
            onGenerateLandingPage={(dev) => {
              setPreselectedLpDev(dev);
              setAdminTab('landing_pages');
            }}
          />
        )}
        {adminTab === 'leads' && (
          <AdminLeads
            leads={leads}
            onRefresh={loadAllData}
            brokerWhatsApp={settings.whatsapp}
          />
        )}
        {adminTab === 'landing_pages' && (
          <AdminLandingPageGenerator
            developments={developments}
            landingPages={landingPages}
            onRefresh={loadAllData}
            onOpenPublicLandingPage={(slug) => handleNavigate('landing_page', slug)}
            preselectedDev={preselectedLpDev}
          />
        )}
        {adminTab === 'site_editor' && (
          <AdminSiteEditor settings={settings} onRefresh={loadAllData} />
        )}
        {adminTab === 'reports' && (
          <AdminReports
            developments={developments}
            leads={leads}
            landingPages={landingPages}
            settings={settings}
            onRefreshSettings={loadAllData}
          />
        )}
      </AdminLayout>
    );
  }

  /* RENDER 4: Public Property Detail View */
  if (currentView === 'property_detail' && selectedDevelopment) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-[#f8fafc] flex flex-col justify-between">
        <Header
          settings={settings}
          onNavigate={handleNavigate}
          currentView={currentView}
        />
        <main className="flex-1">
          <PropertyDetailPage
            development={selectedDevelopment}
            allDevelopments={developments}
            settings={settings}
            onBack={() => handleNavigate('vitrine')}
            onSelectDevelopment={(dev) => handleNavigate('property_detail', dev.slug)}
          />
        </main>
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
        />
        <VirtualAssistant
          settings={settings}
          developments={developments}
          onNavigateToProperty={(slug) => handleNavigate('property_detail', slug)}
          onExploreVitrine={() => handleNavigate('vitrine')}
        />
        <FloatingSocialActions settings={settings} />
        <CookieBanner onOpenPrivacy={() => setPrivacyModalOpen(true)} />
        <PrivacyPolicyModal
          isOpen={privacyModalOpen}
          onClose={() => setPrivacyModalOpen(false)}
          settings={settings}
        />
      </div>
    );
  }

  /* RENDER 5: Institutional Public Website (Home, Vitrine, Lançamentos) */
  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#f8fafc] flex flex-col justify-between">
      <Header
        settings={settings}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main className="flex-1">
        {/* Hero Section on Home */}
        {currentView === 'home' && (
          <Hero
            settings={settings}
            developments={developments}
            onSelectDevelopment={(dev) => handleNavigate('property_detail', dev.slug)}
            onExplore={() => {
              document.getElementById('empreendimentos-vitrine')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onContact={() => {
              document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Property Search Bar */}
        <PropertySearch
          filters={searchFilters}
          onFilterChange={setSearchFilters}
          availableCities={availableCities}
          totalResults={filteredDevelopments.length}
        />

        {/* Dynamic Property Showcase */}
        <PropertyShowcase
          title={
            currentView === 'lancamentos'
              ? 'Lançamentos Imobiliários de Alto Padrão'
              : 'Empreendimentos em Destaque'
          }
          subtitle={
            currentView === 'lancamentos'
              ? 'Unidades exclusivas na planta com as melhores condições de investidor e tabelas antecipadas.'
              : 'Conheça residências com arquitetura premiada, coberturas icônicas e acabamento internacional.'
          }
          developments={filteredDevelopments}
          onSelectDevelopment={(dev) => handleNavigate('property_detail', dev.slug)}
          onInquireWhatsApp={(dev) => {
            const phone = settings.whatsapp || '5511998765432';
            const msg = encodeURIComponent(
              `Olá, Ittala! Gostaria de informações sobre o empreendimento ${dev.title}.`
            );
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
          }}
          isLoading={isLoading}
        />

        {/* About Broker Section */}
        <AboutSection
          settings={settings}
          onContact={() => {
            document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Contact & Consultation Section */}
        <section id="contato-section" className="py-24 relative overflow-hidden bg-[#090d15]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#d4af37] block mb-2">
                Atendimento Personalizado
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-bold tracking-tight mb-4">
                Encontre o imóvel ideal com total confidencialidade
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                Preencha o formulário para receber uma seleção personalizada de imóveis alinhados ao seu
                perfil ou agendar uma reunião exclusiva com Ittala Dias.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <LeadForm
                origin="formulario_rodape_home"
                brokerWhatsApp={settings.whatsapp}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      <VirtualAssistant
        settings={settings}
        developments={developments}
        onNavigateToProperty={(slug) => handleNavigate('property_detail', slug)}
        onExploreVitrine={() => {
          document.getElementById('empreendimentos-vitrine')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <FloatingSocialActions settings={settings} />

      <CookieBanner onOpenPrivacy={() => setPrivacyModalOpen(true)} />
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        settings={settings}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

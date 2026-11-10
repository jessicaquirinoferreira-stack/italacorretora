export type PropertyStatus = 'lancamento' | 'em_obras' | 'pronto' | 'oportunidade';

export type PropertyType = 'Apartamento' | 'Cobertura' | 'Mansão' | 'Casa em Condomínio' | 'Terreno' | 'Comercial';

export type LeadStatus = 'novo' | 'em_atendimento' | 'interessado' | 'visita_agendada' | 'proposta' | 'convertido' | 'perdido';

export type LandingPageTemplate = 'luxury' | 'minimalist' | 'launch' | 'family' | 'investment' | 'commercial';

export interface Development {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  developer: string;
  city: string;
  neighborhood: string;
  address: string;
  startingPrice: number;
  propertyType: PropertyType;
  areaMin: number;
  areaMax: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  status: PropertyStatus;
  deliveryForecast: string;
  coverImage: string;
  gallery: string[];
  floorPlans: { title: string; imageUrl: string; area: string }[];
  videoUrl?: string;
  highlights: string[];
  description: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPage {
  id: string;
  developmentId: string;
  developmentTitle: string;
  slug: string;
  templateId: LandingPageTemplate;
  headline: string;
  subheadline: string;
  customPriceText?: string;
  ctaWhatsAppText: string;
  heroImageUrl: string;
  highlights?: string[];
  active: boolean;
  viewsCount: number;
  leadsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  developmentId?: string;
  developmentTitle?: string;
  investmentRange?: string;
  message?: string;
  origin: string;
  pageUrl?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: LeadStatus;
  notes?: string;
  lgpdConsent: boolean;
  createdAt: string;
}

export interface SiteSettings {
  brokerName: string;
  creci: string;
  bio: string;
  photoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  cities: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  googleAnalyticsId: string;
  googleAdsId: string;
  searchConsoleSite: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id?: string;
  eventType: 'page_view' | 'whatsapp_click' | 'form_submit' | 'share_click';
  pageUrl: string;
  developmentId?: string;
  createdAt: string;
}

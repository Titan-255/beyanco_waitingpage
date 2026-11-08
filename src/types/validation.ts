export type ProfessionalRole =
  | 'Real Estate Agent / Broker'
  | 'Real Estate Agency Owner'
  | 'Interior Designer'
  | 'Property Photographer'
  | 'Builder / Developer'
  | 'Property Owner / Landlord'
  | 'Other';

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  professionalRole?: string;
  company?: string;
  country?: string;
  city?: string;
  marketingConsent: boolean;
  source: string;
  utm?: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackEntry {
  id: string;
  waitlistId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  role: string;
  country?: string;
  city?: string;
  company?: string;
  propertyVolume?: string;
  currentWorkflow?: string[];
  painPoints?: string[];
  currentSpending?: string;
  currency?: string;
  featurePreferences?: string[];
  topThreeFeatures?: string[];
  wishlistFeature?: string;
  purchaseIntent?: string;
  preferredPricingModel?: string;
  priceExpectationPerRoom?: string;
  comfortablePriceNotes?: string;
  earlyAccessInterest?: string;
  interviewInterest?: string;
  marketingConsent: boolean;
  utm?: Record<string, string>;
  createdAt: string;
}

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

  // New Questionnaire Fields (10 questions)
  q1_user_type?: string; // Question 1 (Required)
  q2_buying_timeline?: string; // Question 2 (Optional)
  q3_where_buy?: string[]; // Question 3 (Optional)
  q4_hardest_part?: string[]; // Question 4 (Optional)
  q5_regret_experience?: string; // Question 5 (Optional)
  q6_usefulness_rating?: number; // Question 6 (Required, 1-5)
  q7_ranked_features?: string[]; // Question 7 (Optional, ranked)
  q8_comfort_factors?: string[]; // Question 8 (Optional)
  q9_budget_spend?: string; // Question 9 (Optional)
  q10_one_thing_perfect?: string; // Question 10 (Required)

  // Backward compatibility fields
  role?: string;
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

  // Preferences & Interview
  interviewInterest?: string;
  marketingConsent: boolean;
  utm?: Record<string, string>;
  createdAt: string;
}

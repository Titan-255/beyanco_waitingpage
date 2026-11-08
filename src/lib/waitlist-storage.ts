import fs from "fs";
import path from "path";
import { WaitlistEntry, FeedbackEntry } from "@/types/validation";

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);
const BASE_DATA_DIR = path.join(process.cwd(), "data");
const DATA_DIR = isVercel ? path.join("/tmp", "beyanco_data") : BASE_DATA_DIR;
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // When running on Vercel lambda, seed initial files from repo to /tmp if not yet seeded
  if (isVercel) {
    const baseWaitlist = path.join(BASE_DATA_DIR, "waitlist.json");
    if (!fs.existsSync(WAITLIST_FILE) && fs.existsSync(baseWaitlist)) {
      try {
        fs.copyFileSync(baseWaitlist, WAITLIST_FILE);
      } catch {}
    }
    const baseFeedback = path.join(BASE_DATA_DIR, "feedback.json");
    if (!fs.existsSync(FEEDBACK_FILE) && fs.existsSync(baseFeedback)) {
      try {
        fs.copyFileSync(baseFeedback, FEEDBACK_FILE);
      } catch {}
    }
  }
}

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, validTimestamps);
  return true;
}

export function readWaitlist(): WaitlistEntry[] {
  ensureDirectoryExists();
  if (!fs.existsSync(WAITLIST_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(WAITLIST_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch (error) {
    console.error("Error reading waitlist.json:", error);
    return [];
  }
}

export function saveWaitlistEntry(entryData: Omit<WaitlistEntry, "id" | "createdAt">): {
  entry: WaitlistEntry;
  isDuplicate: boolean;
} {
  ensureDirectoryExists();
  const list = readWaitlist();
  const normalizedEmail = entryData.email.trim().toLowerCase();

  const existingIndex = list.findIndex(
    (item) => item.email.trim().toLowerCase() === normalizedEmail
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing record
    const updatedEntry: WaitlistEntry = {
      ...list[existingIndex],
      name: entryData.name || list[existingIndex].name,
      professionalRole: entryData.professionalRole || list[existingIndex].professionalRole,
      company: entryData.company || list[existingIndex].company,
      country: entryData.country || list[existingIndex].country,
      city: entryData.city || list[existingIndex].city,
      marketingConsent: entryData.marketingConsent ?? list[existingIndex].marketingConsent,
      updatedAt: now,
    };
    list[existingIndex] = updatedEntry;
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2), "utf-8");
    return { entry: updatedEntry, isDuplicate: true };
  }

  const id = `wl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const newEntry: WaitlistEntry = {
    ...entryData,
    email: normalizedEmail,
    id,
    createdAt: now,
  };

  list.unshift(newEntry);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2), "utf-8");
  return { entry: newEntry, isDuplicate: false };
}

export function readFeedback(): FeedbackEntry[] {
  ensureDirectoryExists();
  if (!fs.existsSync(FEEDBACK_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(FEEDBACK_FILE, "utf-8");
    return JSON.parse(raw) as FeedbackEntry[];
  } catch (error) {
    console.error("Error reading feedback.json:", error);
    return [];
  }
}

export function saveFeedbackEntry(entryData: Omit<FeedbackEntry, "id" | "createdAt">): FeedbackEntry {
  ensureDirectoryExists();
  const list = readFeedback();

  const id = `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const newEntry: FeedbackEntry = {
    ...entryData,
    contactEmail: entryData.contactEmail ? entryData.contactEmail.trim().toLowerCase() : undefined,
    id,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newEntry);
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), "utf-8");
  return newEntry;
}

export function getValidationMetrics() {
  const waitlist = readWaitlist();
  const feedback = readFeedback();

  // Role distribution in waitlist
  const waitlistRoles: Record<string, number> = {};
  waitlist.forEach((w) => {
    const role = w.professionalRole || "Unspecified";
    waitlistRoles[role] = (waitlistRoles[role] || 0) + 1;
  });

  // Role distribution in feedback
  const feedbackRoles: Record<string, number> = {};
  const painPointsCount: Record<string, number> = {};
  const featureInterestCount: Record<string, number> = {};
  const topThreeFeaturesCount: Record<string, number> = {};
  const purchaseIntentCount: Record<string, number> = {};
  const pricingModelCount: Record<string, number> = {};
  const priceExpectationCount: Record<string, number> = {};

  feedback.forEach((f) => {
    if (f.role) {
      feedbackRoles[f.role] = (feedbackRoles[f.role] || 0) + 1;
    }
    (f.painPoints || []).forEach((p) => {
      painPointsCount[p] = (painPointsCount[p] || 0) + 1;
    });
    (f.featurePreferences || []).forEach((feat) => {
      featureInterestCount[feat] = (featureInterestCount[feat] || 0) + 1;
    });
    (f.topThreeFeatures || []).forEach((feat) => {
      topThreeFeaturesCount[feat] = (topThreeFeaturesCount[feat] || 0) + 1;
    });
    if (f.purchaseIntent) {
      purchaseIntentCount[f.purchaseIntent] = (purchaseIntentCount[f.purchaseIntent] || 0) + 1;
    }
    if (f.preferredPricingModel) {
      pricingModelCount[f.preferredPricingModel] = (pricingModelCount[f.preferredPricingModel] || 0) + 1;
    }
    if (f.priceExpectationPerRoom) {
      priceExpectationCount[f.priceExpectationPerRoom] = (priceExpectationCount[f.priceExpectationPerRoom] || 0) + 1;
    }
  });

  return {
    totalWaitlist: waitlist.length,
    totalFeedback: feedback.length,
    waitlistRoles,
    feedbackRoles,
    painPointsCount,
    featureInterestCount,
    topThreeFeaturesCount,
    purchaseIntentCount,
    pricingModelCount,
    priceExpectationCount,
  };
}

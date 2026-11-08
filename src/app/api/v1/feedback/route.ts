import { NextRequest, NextResponse } from "next/server";
import {
  saveFeedbackEntry,
  readFeedback,
  checkRateLimit,
} from "@/lib/waitlist-storage";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please wait a minute before retrying." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot trap check
    if (body.website_trap || body.hp_field) {
      return NextResponse.json({ success: true, message: "Feedback received." }, { status: 200 });
    }

    if (!body.role && !body.professionalRole) {
      return NextResponse.json(
        { success: false, error: "Please indicate your professional role." },
        { status: 400 }
      );
    }

    const entry = saveFeedbackEntry({
      waitlistId: body.waitlistId,
      contactName: body.contactName ? body.contactName.trim() : body.name?.trim(),
      contactEmail: body.contactEmail ? body.contactEmail.trim() : body.email?.trim(),
      contactPhone: body.contactPhone ? body.contactPhone.trim() : undefined,
      role: body.role || body.professionalRole,
      country: body.country ? body.country.trim() : undefined,
      city: body.city ? body.city.trim() : undefined,
      company: body.company ? body.company.trim() : undefined,
      propertyVolume: body.propertyVolume,
      currentWorkflow: Array.isArray(body.currentWorkflow) ? body.currentWorkflow : [],
      painPoints: Array.isArray(body.painPoints) ? body.painPoints : [],
      currentSpending: body.currentSpending,
      currency: body.currency || "USD",
      featurePreferences: Array.isArray(body.featurePreferences) ? body.featurePreferences : [],
      topThreeFeatures: Array.isArray(body.topThreeFeatures) ? body.topThreeFeatures : [],
      wishlistFeature: body.wishlistFeature ? body.wishlistFeature.trim() : undefined,
      purchaseIntent: body.purchaseIntent,
      preferredPricingModel: body.preferredPricingModel,
      priceExpectationPerRoom: body.priceExpectationPerRoom,
      comfortablePriceNotes: body.comfortablePriceNotes ? body.comfortablePriceNotes.trim() : undefined,
      earlyAccessInterest: body.earlyAccessInterest,
      interviewInterest: body.interviewInterest,
      marketingConsent: Boolean(body.marketingConsent),
      utm: body.utm || {},
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for helping shape Beyanco! Your feedback has been securely received.",
        id: entry.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to record feedback. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const list = readFeedback();
    return NextResponse.json({
      success: true,
      totalFeedback: list.length,
      status: "active",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

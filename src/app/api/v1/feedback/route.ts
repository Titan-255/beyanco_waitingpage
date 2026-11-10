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

    // Required questions: Question 1, Question 6, Question 10
    const userType = body.q1_user_type || body.role || body.professionalRole;
    if (!userType || !userType.trim()) {
      return NextResponse.json(
        { success: false, error: "Please answer Question 1 (Which best describes you?)." },
        { status: 400 }
      );
    }

    if (body.q6_usefulness_rating !== undefined) {
      const rating = Number(body.q6_usefulness_rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid rating (1 to 5) for Question 6." },
          { status: 400 }
        );
      }
    }

    if (body.q10_one_thing_perfect !== undefined && !body.q10_one_thing_perfect.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a response for Question 10." },
        { status: 400 }
      );
    }

    // Normalize phone number if present
    let normalizedPhone: string | undefined = undefined;
    if (body.contactPhone || body.mobile || body.phone) {
      const rawPhone = (body.contactPhone || body.mobile || body.phone).trim();
      // Remove any unwanted characters except +, digits, spaces, and hyphens
      normalizedPhone = rawPhone.replace(/[^\d+ -]/g, "");
    }

    const entry = saveFeedbackEntry({
      waitlistId: body.waitlistId,
      contactName: body.contactName ? body.contactName.trim() : body.name?.trim(),
      contactEmail: body.contactEmail ? body.contactEmail.trim().toLowerCase() : body.email?.trim().toLowerCase(),
      contactPhone: normalizedPhone,

      // 10-Question Questionnaire fields
      q1_user_type: userType.trim(),
      q2_buying_timeline: body.q2_buying_timeline || undefined,
      q3_where_buy: Array.isArray(body.q3_where_buy) ? body.q3_where_buy : undefined,
      q4_hardest_part: Array.isArray(body.q4_hardest_part) ? body.q4_hardest_part : undefined,
      q5_regret_experience: body.q5_regret_experience ? body.q5_regret_experience.trim() : undefined,
      q6_usefulness_rating: body.q6_usefulness_rating ? Number(body.q6_usefulness_rating) : undefined,
      q7_ranked_features: Array.isArray(body.q7_ranked_features) ? body.q7_ranked_features : undefined,
      q8_comfort_factors: Array.isArray(body.q8_comfort_factors) ? body.q8_comfort_factors : undefined,
      q9_budget_spend: body.q9_budget_spend || undefined,
      q10_one_thing_perfect: body.q10_one_thing_perfect ? body.q10_one_thing_perfect.trim() : undefined,

      // Backward compatibility fields
      role: userType.trim(),
      country: body.country ? body.country.trim() : undefined,
      city: body.city ? body.city.trim() : undefined,
      company: body.company ? body.company.trim() : undefined,
      propertyVolume: body.propertyVolume,
      currentWorkflow: Array.isArray(body.currentWorkflow) ? body.currentWorkflow : [],
      painPoints: Array.isArray(body.painPoints) ? body.painPoints : [],
      currentSpending: body.currentSpending,
      currency: body.currency || "INR",
      featurePreferences: Array.isArray(body.featurePreferences) ? body.featurePreferences : [],
      topThreeFeatures: Array.isArray(body.topThreeFeatures) ? body.topThreeFeatures : [],
      wishlistFeature: body.wishlistFeature ? body.wishlistFeature.trim() : undefined,
      purchaseIntent: body.purchaseIntent,
      preferredPricingModel: body.preferredPricingModel,
      priceExpectationPerRoom: body.priceExpectationPerRoom,
      comfortablePriceNotes: body.comfortablePriceNotes ? body.comfortablePriceNotes.trim() : undefined,
      earlyAccessInterest: body.earlyAccessInterest,

      // Permissions & Opt-ins
      interviewInterest: body.interviewInterest || undefined,
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

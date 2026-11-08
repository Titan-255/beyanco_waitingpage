import { NextResponse } from "next/server";
import { getValidationMetrics, readWaitlist, readFeedback } from "@/lib/waitlist-storage";

export async function GET() {
  try {
    const metrics = getValidationMetrics();
    const waitlist = readWaitlist();
    const feedback = readFeedback();

    return NextResponse.json({
      success: true,
      metrics,
      recentWaitlist: waitlist.slice(0, 10).map((w) => ({
        id: w.id,
        name: w.name,
        role: w.professionalRole,
        company: w.company,
        country: w.country,
        createdAt: w.createdAt,
      })),
      recentFeedback: feedback.slice(0, 10).map((f) => ({
        id: f.id,
        role: f.role,
        propertyVolume: f.propertyVolume,
        purchaseIntent: f.purchaseIntent,
        preferredPricingModel: f.preferredPricingModel,
        priceExpectationPerRoom: f.priceExpectationPerRoom,
        earlyAccessInterest: f.earlyAccessInterest,
        createdAt: f.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

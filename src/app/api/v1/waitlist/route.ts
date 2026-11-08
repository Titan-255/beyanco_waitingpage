import { NextRequest, NextResponse } from "next/server";
import {
  saveWaitlistEntry,
  readWaitlist,
  checkRateLimit,
} from "@/lib/waitlist-storage";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check for bots
    if (body.website_trap || body.hp_field) {
      return NextResponse.json({ success: true, message: "Registered successfully." }, { status: 200 });
    }

    const { name, email, professionalRole, company, country, city, marketingConsent, source, utm } = body;

    // Validation
    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide your name." },
        { status: 400 }
      );
    }

    const { entry, isDuplicate } = saveWaitlistEntry({
      name: name.trim(),
      email: email.trim(),
      professionalRole: professionalRole || "Interested Professional",
      company: company ? company.trim() : undefined,
      country: country ? country.trim() : undefined,
      city: city ? city.trim() : undefined,
      marketingConsent: Boolean(marketingConsent),
      source: source || "landing_page",
      utm: utm || {},
    });

    return NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Welcome back! Your early-access preference has been updated."
          : "You're on the Beyanco waitlist! We'll be in touch as early access unlocks.",
        id: entry.id,
        isDuplicate,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to process waitlist signup. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const list = readWaitlist();
    return NextResponse.json({
      success: true,
      totalCount: list.length,
      status: "active",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

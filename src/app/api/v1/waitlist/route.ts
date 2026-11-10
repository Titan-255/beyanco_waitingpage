import { NextRequest, NextResponse } from "next/server";
import {
  saveWaitlistEntry,
  updateWaitlistEmailStatus,
  readWaitlist,
  checkRateLimit,
} from "@/lib/waitlist-storage";
import {
  sendWaitlistAdminNotification,
  sendWaitlistUserConfirmation,
} from "@/lib/email-service";

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

    const {
      name,
      email,
      phone,
      mobile,
      mobile_number,
      professionalRole,
      company,
      country,
      city,
      marketingConsent,
      source,
      utm,
    } = body;

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

    // Sanitize mobile/phone if provided
    const rawMobile = mobile_number || mobile || phone;
    const sanitizedMobile = rawMobile && typeof rawMobile === "string"
      ? rawMobile.replace(/[^\d+ -]/g, "").trim()
      : undefined;

    // 1. SAVE TO DATABASE FIRST (Persistence must never fail due to email)
    const { entry, isDuplicate } = saveWaitlistEntry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile_number: sanitizedMobile,
      professionalRole: professionalRole || "Interested Professional",
      company: company ? company.trim() : undefined,
      country: country ? country.trim() : undefined,
      city: city ? city.trim() : undefined,
      marketingConsent: Boolean(marketingConsent),
      source: source || "landing_page",
      utm: utm || {},
      email_notification_status: "pending",
      user_confirmation_status: "pending",
    });

    // 2. TRIGGER EMAIL NOTIFICATIONS SAFELY
    let adminEmailStatus: "sent" | "failed" | "queued" | "pending" = "pending";
    let userEmailStatus: "sent" | "failed" | "queued" | "pending" = "pending";

    try {
      // Trigger internal administrator notification to akash@beyanco.com
      const adminRes = await sendWaitlistAdminNotification(entry);
      adminEmailStatus = adminRes.status;
    } catch (adminErr) {
      console.error("Waitlist admin email error:", adminErr);
      adminEmailStatus = "failed";
    }

    try {
      // Trigger confirmation email to registered user
      const userRes = await sendWaitlistUserConfirmation(entry);
      userEmailStatus = userRes.status;
    } catch (userErr) {
      console.error("Waitlist user confirmation email error:", userErr);
      userEmailStatus = "failed";
    }

    // 3. UPDATE DATABASE WITH EMAIL STATUSES
    try {
      updateWaitlistEmailStatus(entry.id, {
        email_notification_status: adminEmailStatus,
        user_confirmation_status: userEmailStatus,
      });
    } catch (updateErr) {
      console.error("Failed to update waitlist email status:", updateErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Welcome back! Your early-access preference has been updated."
          : "You're on the Beyanco waitlist! We'll be in touch as early access unlocks.",
        id: entry.id,
        isDuplicate,
        email_status: {
          admin: adminEmailStatus,
          user: userEmailStatus,
        },
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

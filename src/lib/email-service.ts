import fs from "fs";
import path from "path";
import { WaitlistEntry, FeedbackEntry } from "@/types/validation";

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);
const BASE_DATA_DIR = path.join(process.cwd(), "data");
const DATA_DIR = isVercel ? path.join("/tmp", "beyanco_data") : BASE_DATA_DIR;
const OUTBOX_FILE = path.join(DATA_DIR, "email_outbox.json");

export interface OutboxEmailRecord {
  id: string;
  type:
    | "waitlist_admin_notification"
    | "waitlist_user_confirmation"
    | "feedback_admin_notification"
    | "feedback_user_thank_you";
  submissionId: string;
  to: string;
  subject: string;
  status: "sent" | "failed" | "queued";
  sentAt?: string;
  error?: string;
  payloadSummary: Record<string, any>;
  createdAt: string;
}

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readEmailOutbox(): OutboxEmailRecord[] {
  ensureDirectoryExists();
  if (!fs.existsSync(OUTBOX_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(OUTBOX_FILE, "utf-8");
    return JSON.parse(raw) as OutboxEmailRecord[];
  } catch (error) {
    console.error("Error reading email_outbox.json:", error);
    return [];
  }
}

export function recordOutboxEmail(record: OutboxEmailRecord): void {
  ensureDirectoryExists();
  try {
    const outbox = readEmailOutbox();
    // Check if record already exists by submissionId and type for idempotency
    const existingIdx = outbox.findIndex(
      (r) => r.submissionId === record.submissionId && r.type === record.type
    );
    if (existingIdx >= 0) {
      outbox[existingIdx] = record;
    } else {
      outbox.unshift(record);
    }
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify(outbox, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving to email outbox:", err);
  }
}

// Config getters
export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY || "";
  const fromEmail =
    process.env.FROM_EMAIL || "Beyanco <notifications@beyanco.com>";
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || "akash@beyanco.com";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://beyanco-waitingpage.vercel.app";

  return {
    apiKey,
    fromEmail,
    adminEmail,
    appUrl,
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0),
  };
}

/**
 * Dispatch an email via Resend API with graceful fallback to outbox recording.
 * Never throws an error that interrupts the user or aborts database storage.
 */
async function dispatchEmail(params: {
  type: OutboxEmailRecord["type"];
  submissionId: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  payloadSummary: Record<string, any>;
}): Promise<{ success: boolean; status: "sent" | "failed" | "queued"; error?: string }> {
  const { apiKey, fromEmail } = getEmailConfig();
  const recordId = `em_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // If no API key configured, record in outbox as queued
  if (!apiKey) {
    const record: OutboxEmailRecord = {
      id: recordId,
      type: params.type,
      submissionId: params.submissionId,
      to: params.to,
      subject: params.subject,
      status: "queued",
      payloadSummary: params.payloadSummary,
      createdAt: now,
      error: "RESEND_API_KEY not configured. Queued in outbox for dispatch.",
    };
    recordOutboxEmail(record);
    return { success: false, status: "queued", error: record.error };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data.message || `Resend API returned status ${res.status}`;
      const record: OutboxEmailRecord = {
        id: recordId,
        type: params.type,
        submissionId: params.submissionId,
        to: params.to,
        subject: params.subject,
        status: "failed",
        error: errMsg,
        payloadSummary: params.payloadSummary,
        createdAt: now,
      };
      recordOutboxEmail(record);
      return { success: false, status: "failed", error: errMsg };
    }

    const record: OutboxEmailRecord = {
      id: recordId,
      type: params.type,
      submissionId: params.submissionId,
      to: params.to,
      subject: params.subject,
      status: "sent",
      sentAt: now,
      payloadSummary: params.payloadSummary,
      createdAt: now,
    };
    recordOutboxEmail(record);
    return { success: true, status: "sent" };
  } catch (err: any) {
    const errMsg = err?.message || "Network exception during email dispatch";
    const record: OutboxEmailRecord = {
      id: recordId,
      type: params.type,
      submissionId: params.submissionId,
      to: params.to,
      subject: params.subject,
      status: "failed",
      error: errMsg,
      payloadSummary: params.payloadSummary,
      createdAt: now,
    };
    recordOutboxEmail(record);
    return { success: false, status: "failed", error: errMsg };
  }
}

// ----------------------------------------------------------------------
// 1. Waitlist Admin Notification (to akash@beyanco.com)
// ----------------------------------------------------------------------
export async function sendWaitlistAdminNotification(entry: WaitlistEntry): Promise<{
  success: boolean;
  status: "sent" | "failed" | "queued";
  error?: string;
}> {
  const { adminEmail, appUrl } = getEmailConfig();

  const subject = "New Beyanco Waitlist Registration";

  const plainText = `
BEYANCO AI — NEW WAITLIST REGISTRATION
A new person has registered for early access to Beyanco.

Registration Details:
Name: ${entry.name || "Not Provided"}
Email: ${entry.email}
Mobile Number: ${entry.mobile_number || "Not Provided"}
Professional Role: ${entry.professionalRole || "Not Provided"}
Country: ${entry.country || "Not Provided"}
City: ${entry.city || "Not Provided"}
Company: ${entry.company || "Not Provided"}
Early Access / Marketing Consent: ${entry.marketingConsent ? "Yes" : "No"}
Registration Date: ${entry.createdAt}
Registration ID: ${entry.id}
Source: ${entry.source || "Landing Page"}
  `.trim();

  const logoUrl = `${appUrl}/beyanco-logo.jpg`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Beyanco Waitlist Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #101827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4EF; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #D8D5CF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(16,24,39,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #ECEAE4; text-align: left;">
              <img src="${logoUrl}" alt="Beyanco" height="36" style="display: block; height: 36px; max-width: 180px; object-fit: contain;" />
              <div style="margin-top: 16px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A98460;">
                Waitlist Registration Alert
              </div>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; color: #101827;">
                New Waitlist Registration
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #374151;">
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #626A75;">
                A new user has submitted their details to join the Beyanco early-access waitlist.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E5E2DA; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; width: 38%; font-size: 13px;">Full Name</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 700; color: #101827; font-size: 13px;">${entry.name || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Email Address</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 700; color: #101827; font-size: 13px;"><a href="mailto:${entry.email}" style="color: #101827; text-decoration: underline;">${entry.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Mobile Number</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; color: #101827; font-size: 13px;">${entry.mobile_number || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Professional Role</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; color: #101827; font-size: 13px;">${entry.professionalRole || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Company</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; color: #101827; font-size: 13px;">${entry.company || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Location</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; color: #101827; font-size: 13px;">${[entry.city, entry.country].filter(Boolean).join(", ") || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Marketing Consent</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; color: #101827; font-size: 13px;">${entry.marketingConsent ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; font-size: 13px;">Registration ID</td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #EAE7DF; font-family: monospace; font-size: 12px; color: #626A75;">${entry.id}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-weight: 600; color: #626A75; font-size: 13px;">Timestamp</td>
                  <td style="padding: 14px 18px; font-size: 12px; color: #626A75;">${entry.createdAt}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #FAF8F5; border-top: 1px solid #ECEAE4; font-size: 12px; color: #8C877D; text-align: center;">
              Beyanco AI Waitlist System • Automated Internal Notification
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return dispatchEmail({
    type: "waitlist_admin_notification",
    submissionId: entry.id,
    to: adminEmail,
    subject,
    html,
    text: plainText,
    payloadSummary: {
      id: entry.id,
      name: entry.name,
      email: entry.email,
      role: entry.professionalRole,
    },
  });
}

// ----------------------------------------------------------------------
// 2. Waitlist User Confirmation (to respondent)
// ----------------------------------------------------------------------
export async function sendWaitlistUserConfirmation(entry: WaitlistEntry): Promise<{
  success: boolean;
  status: "sent" | "failed" | "queued";
  error?: string;
}> {
  if (!entry.email || !entry.email.includes("@")) {
    return { success: false, status: "failed", error: "Invalid respondent email address" };
  }

  const { appUrl } = getEmailConfig();
  const subject = "You're on the Beyanco Waitlist!";

  const greetingName = entry.name ? entry.name.split(" ")[0] : "there";

  const plainText = `
Hi ${greetingName},

Thank you for showing interest in Beyanco! We're excited that you want to be part of our journey.

Beyanco is being built to help people visualize furniture in their own spaces, explore interior possibilities and make more confident furniture-shopping decisions.

You've successfully registered your interest in early access.

We'll keep you informed as Beyanco develops and share early-access information when it becomes available.

Thank you for being part of Beyanco.

Warm regards,
Team Beyanco
https://beyanco-waitingpage.vercel.app
  `.trim();

  const logoUrl = `${appUrl}/beyanco-logo.jpg`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You're on the Beyanco Waitlist!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #101827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4EF; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #D8D5CF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(16,24,39,0.06);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 36px 36px 24px 36px; text-align: left; border-bottom: 1px solid #ECEAE4;">
              <img src="${logoUrl}" alt="Beyanco" height="38" style="display: block; height: 38px; max-width: 180px; object-fit: contain;" />
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 36px; font-size: 15px; line-height: 1.7; color: #374151;">
              
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A98460; margin-bottom: 8px;">
                CONFIRMATION
              </div>

              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #101827; letter-spacing: -0.5px;">
                You're on the Beyanco Waitlist!
              </h1>

              <p style="margin: 0 0 16px 0; color: #101827; font-weight: 500;">
                Hi ${greetingName},
              </p>

              <p style="margin: 0 0 16px 0;">
                Thank you for showing interest in Beyanco! We&apos;re excited that you want to be part of our journey.
              </p>

              <p style="margin: 0 0 16px 0;">
                Beyanco is being built to help people visualize furniture in their own spaces, explore interior possibilities and make more confident furniture-shopping decisions.
              </p>

              <div style="background-color: #FAF8F5; border-left: 3px solid #A98460; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #101827; font-weight: 600;">
                  You&apos;ve successfully registered your interest in early access.
                </p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #626A75;">
                  We&apos;ll keep you informed as Beyanco develops and share early-access information when it becomes available.
                </p>
              </div>

              <p style="margin: 24px 0 8px 0;">
                Thank you for being part of Beyanco.
              </p>

              <p style="margin: 0; color: #101827; font-weight: 600;">
                Warm regards,<br />
                <span style="color: #A98460;">Team Beyanco</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF8F5; border-top: 1px solid #ECEAE4; font-size: 12px; color: #8C877D; text-align: center;">
              Beyanco AI • Your Vision. Intelligently Designed.<br />
              <span style="font-size: 11px; color: #A09B90; margin-top: 4px; display: inline-block;">
                This email was sent to confirm your waitlist registration.
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return dispatchEmail({
    type: "waitlist_user_confirmation",
    submissionId: entry.id,
    to: entry.email,
    subject,
    html,
    text: plainText,
    payloadSummary: {
      id: entry.id,
      name: entry.name,
      email: entry.email,
    },
  });
}

// ----------------------------------------------------------------------
// 3. Feedback Admin Notification (to akash@beyanco.com)
// ----------------------------------------------------------------------
export async function sendFeedbackAdminNotification(entry: FeedbackEntry): Promise<{
  success: boolean;
  status: "sent" | "failed" | "queued";
  error?: string;
}> {
  const { adminEmail, appUrl } = getEmailConfig();
  const subject = "New Beyanco Customer Feedback Submission";

  const plainText = `
BEYANCO AI — NEW CUSTOMER FEEDBACK
A visitor has submitted feedback about Beyanco.

CONTACT DETAILS
Name: ${entry.contactName || "Anonymous"}
Email: ${entry.contactEmail || "Not Provided"}
Mobile Number: ${entry.contactPhone || "Not Provided"}
Professional Role: ${entry.q1_user_type || entry.role || "Not Specified"}
Country: ${entry.country || "Not Provided"}
City: ${entry.city || "Not Provided"}
Company: ${entry.company || "Not Provided"}

QUESTIONNAIRE RESPONSES
Question 1: Which best describes you?
Answer: ${entry.q1_user_type || entry.role || "Not Answered"}

Question 2: Are you planning to buy furniture in the next 6 months?
Answer: ${entry.q2_buying_timeline || "Skipped"}

Question 3: Where do you usually discover or buy furniture?
Answer: ${entry.q3_where_buy && entry.q3_where_buy.length > 0 ? entry.q3_where_buy.join(", ") : "Skipped"}

Question 4: What is the most frustrating part of buying furniture?
Answer: ${entry.q4_hardest_part && entry.q4_hardest_part.length > 0 ? entry.q4_hardest_part.join("; ") : "Skipped"}

Question 5: Have you ever purchased furniture that looked different from what you expected?
Answer: ${entry.q5_regret_experience || "Skipped"}

Question 6: How useful would it be to see actual furniture products arranged in your own room before purchasing them?
Rating: ${entry.q6_usefulness_rating ? `${entry.q6_usefulness_rating} / 5` : "Not Answered"}

Question 7: Which Beyanco features would be most valuable to you?
Ranking:
${entry.q7_ranked_features && entry.q7_ranked_features.length > 0 ? entry.q7_ranked_features.map((f, i) => `  ${i + 1}. ${f}`).join("\n") : "  Skipped"}

Question 8: What would make you comfortable purchasing furniture through Beyanco?
Answer: ${entry.q8_comfort_factors && entry.q8_comfort_factors.length > 0 ? entry.q8_comfort_factors.join("; ") : "Skipped"}

Question 9: What is your typical budget for a major furniture purchase, such as a sofa or bed?
Answer: ${entry.q9_budget_spend || "Skipped"}

Question 10: If Beyanco could solve ONE problem perfectly when buying furniture, what would you want it to solve?
Answer:
${entry.q10_one_thing_perfect || "Not Answered"}

ADDITIONAL DETAILS
Early Access Interest: ${entry.marketingConsent ? "Yes" : "No"}
Interview Interest: ${entry.interviewInterest || "Not Answered"}
Submission Date: ${entry.createdAt}
Submission ID: ${entry.id}
  `.trim();

  const logoUrl = `${appUrl}/beyanco-logo.jpg`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Beyanco Customer Feedback Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #101827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4EF; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #D8D5CF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(16,24,39,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #ECEAE4; text-align: left;">
              <img src="${logoUrl}" alt="Beyanco" height="36" style="display: block; height: 36px; max-width: 180px; object-fit: contain;" />
              <div style="margin-top: 16px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A98460;">
                Customer Discovery Alert
              </div>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; color: #101827;">
                New Customer Feedback Submission
              </h1>
            </td>
          </tr>

          <!-- Contact Details Block -->
          <tr>
            <td style="padding: 24px 32px 12px 32px;">
              <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #A98460; margin: 0 0 12px 0;">
                Respondent Contact Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E5E2DA; border-radius: 10px; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75; width: 35%;">Name</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 700; color: #101827;">${entry.contactName || "Anonymous"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75;">Email</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #101827;">${entry.contactEmail ? `<a href="mailto:${entry.contactEmail}" style="color: #101827; text-decoration: underline;">${entry.contactEmail}</a>` : "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75;">Mobile</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #101827;">${entry.contactPhone || "Not Provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #626A75;">Interview Call</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #101827;">${entry.interviewInterest || "Not Answered"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: 600; color: #626A75;">Early Access Updates</td>
                  <td style="padding: 10px 14px; color: #101827;">${entry.marketingConsent ? "Yes (Opted-in)" : "No"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Questionnaire Responses Block -->
          <tr>
            <td style="padding: 16px 32px 28px 32px;">
              <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #A98460; margin: 0 0 16px 0;">
                Questionnaire Responses (10 Questions)
              </h2>

              <!-- Q1 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 1 • Profile</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">Which best describes you?</div>
                <div style="font-size: 14px; color: #101827; font-weight: 700;">${entry.q1_user_type || entry.role || "Not Answered"}</div>
              </div>

              <!-- Q2 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 2 • Timeline</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">Are you planning to buy furniture in the next 6 months?</div>
                <div style="font-size: 14px; color: #101827;">${entry.q2_buying_timeline || "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}</div>
              </div>

              <!-- Q3 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 3 • Discovery Channels</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">Where do you usually discover or buy furniture?</div>
                <div style="font-size: 14px; color: #101827;">
                  ${entry.q3_where_buy && entry.q3_where_buy.length > 0 ? entry.q3_where_buy.map((item) => `<span style="display: inline-block; background-color: #FAF8F5; border: 1px solid #D8D5CF; padding: 3px 8px; border-radius: 4px; margin: 2px; font-size: 12px;">${item}</span>`).join(" ") : "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}
                </div>
              </div>

              <!-- Q4 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 4 • Frustrations & Pain Points</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">What is the most frustrating part of buying furniture?</div>
                <div style="font-size: 14px; color: #101827;">
                  ${entry.q4_hardest_part && entry.q4_hardest_part.length > 0 ? `<ul style="margin: 4px 0 0 18px; padding: 0;">${entry.q4_hardest_part.map((p) => `<li style="margin-bottom: 4px; font-size: 13px;">${p}</li>`).join("")}</ul>` : "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}
                </div>
              </div>

              <!-- Q5 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 5 • Experience & Regret</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">Have you ever purchased furniture that looked different from what you expected?</div>
                <div style="font-size: 13px; color: #374151; line-height: 1.6; background-color: #FAF8F5; padding: 10px 12px; border-radius: 6px; margin-top: 6px;">
                  ${entry.q5_regret_experience || "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}
                </div>
              </div>

              <!-- Q6 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 6 • Core Value Rating (1 to 5)</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">How useful would it be to see actual furniture products arranged in your own room before purchasing them?</div>
                <div style="font-size: 16px; font-weight: 700; color: #A98460;">
                  ${entry.q6_usefulness_rating ? `Rating: ${entry.q6_usefulness_rating} / 5` : "Not Answered"}
                </div>
              </div>

              <!-- Q7 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 7 • Feature Priorities (Ranked)</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">Which Beyanco features would be most valuable to you?</div>
                <div style="font-size: 13px; color: #101827;">
                  ${entry.q7_ranked_features && entry.q7_ranked_features.length > 0 ? `<ol style="margin: 4px 0 0 18px; padding: 0;">${entry.q7_ranked_features.map((f) => `<li style="margin-bottom: 4px;"><strong>${f}</strong></li>`).join("")}</ol>` : "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}
                </div>
              </div>

              <!-- Q8 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 8 • Trust & Purchase Factors</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">What would make you comfortable purchasing furniture through Beyanco?</div>
                <div style="font-size: 13px; color: #101827;">
                  ${entry.q8_comfort_factors && entry.q8_comfort_factors.length > 0 ? `<ul style="margin: 4px 0 0 18px; padding: 0;">${entry.q8_comfort_factors.map((c) => `<li style="margin-bottom: 4px;">${c}</li>`).join("")}</ul>` : "<span style='color: #8C877D; font-style: italic;'>Skipped</span>"}
                </div>
              </div>

              <!-- Q9 -->
              <div style="margin-bottom: 16px; padding: 14px; background-color: #FFFFFF; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #8C877D; text-transform: uppercase;">Question 9 • Typical Budget</div>
                <div style="font-size: 13px; font-weight: 600; color: #101827; margin: 2px 0 6px 0;">What is your typical budget for a major furniture purchase, such as a sofa or bed?</div>
                <div style="font-size: 14px; font-weight: 700; color: #101827;">${entry.q9_budget_spend || "<span style='color: #8C877D; font-style: italic; font-weight: normal;'>Skipped</span>"}</div>
              </div>

              <!-- Q10 -->
              <div style="margin-bottom: 8px; padding: 16px; background-color: #FAF8F5; border: 1px solid #E5E2DA; border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #A98460; text-transform: uppercase;">Question 10 • The ONE Problem To Solve</div>
                <div style="font-size: 13px; font-weight: 700; color: #101827; margin: 2px 0 8px 0;">If Beyanco could solve ONE problem perfectly when buying furniture, what would you want it to solve?</div>
                <div style="font-size: 14px; color: #101827; line-height: 1.6; white-space: pre-wrap; font-weight: 500;">${entry.q10_one_thing_perfect || "Not Answered"}</div>
              </div>

            </td>
          </tr>

          <!-- Metadata & Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #FAF8F5; border-top: 1px solid #ECEAE4; font-size: 12px; color: #8C877D; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>Submission ID: <span style="font-family: monospace;">${entry.id}</span></td>
                  <td align="right">Received: ${entry.createdAt}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return dispatchEmail({
    type: "feedback_admin_notification",
    submissionId: entry.id,
    to: adminEmail,
    subject,
    html,
    text: plainText,
    payloadSummary: {
      id: entry.id,
      contactName: entry.contactName,
      contactEmail: entry.contactEmail,
      q1: entry.q1_user_type,
      q6: entry.q6_usefulness_rating,
    },
  });
}

// ----------------------------------------------------------------------
// 4. Feedback Respondent Thank-You (to respondent IF email provided)
// ----------------------------------------------------------------------
export async function sendFeedbackUserThankYou(entry: FeedbackEntry): Promise<{
  success: boolean;
  status: "sent" | "failed" | "queued" | "skipped";
  error?: string;
}> {
  // If respondent did not provide an email, skip gracefully
  if (!entry.contactEmail || !entry.contactEmail.includes("@")) {
    return { success: true, status: "skipped" };
  }

  const { appUrl } = getEmailConfig();
  const subject = "Thank You for Sharing Your Thoughts with Beyanco!";

  const greetingName = entry.contactName ? entry.contactName.split(" ")[0] : "there";

  const plainText = `
Hi ${greetingName},

Thank you for taking the time to share your opinion with Beyanco.

Your feedback means a lot to us. We are building Beyanco to make furniture shopping easier by helping people visualize furniture in their own spaces before making a purchase.

Your suggestions and honest opinions will help us understand what matters most and shape the features we build.

We truly appreciate your time and contribution to Beyanco's journey.

Thank you for being part of our journey!

Warm regards,
Team Beyanco
https://beyanco-waitingpage.vercel.app
  `.trim();

  const logoUrl = `${appUrl}/beyanco-logo.jpg`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Sharing Your Thoughts with Beyanco!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #101827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4EF; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #D8D5CF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(16,24,39,0.06);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 36px 36px 24px 36px; text-align: left; border-bottom: 1px solid #ECEAE4;">
              <img src="${logoUrl}" alt="Beyanco" height="38" style="display: block; height: 38px; max-width: 180px; object-fit: contain;" />
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 36px; font-size: 15px; line-height: 1.7; color: #374151;">
              
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #A98460; margin-bottom: 8px;">
                CUSTOMER FEEDBACK
              </div>

              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #101827; letter-spacing: -0.5px;">
                Thank You for Sharing Your Thoughts with Beyanco!
              </h1>

              <p style="margin: 0 0 16px 0; color: #101827; font-weight: 500;">
                Hi ${greetingName},
              </p>

              <p style="margin: 0 0 16px 0;">
                Thank you for taking the time to share your opinion with Beyanco.
              </p>

              <p style="margin: 0 0 16px 0;">
                Your feedback means a lot to us. We are building Beyanco to make furniture shopping easier by helping people visualize furniture in their own spaces before making a purchase.
              </p>

              <p style="margin: 0 0 16px 0;">
                Your suggestions and honest opinions will help us understand what matters most and shape the features we build.
              </p>

              <div style="background-color: #FAF8F5; border-left: 3px solid #A98460; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #101827; font-weight: 600;">
                  We truly appreciate your time and contribution to Beyanco&apos;s journey.
                </p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #626A75;">
                  Thank you for being part of our journey!
                </p>
              </div>

              <p style="margin: 24px 0 8px 0;">
                Warm regards,
              </p>

              <p style="margin: 0; color: #101827; font-weight: 600;">
                <span style="color: #A98460;">Team Beyanco</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF8F5; border-top: 1px solid #ECEAE4; font-size: 12px; color: #8C877D; text-align: center;">
              Beyanco AI • Your Vision. Intelligently Designed.<br />
              <span style="font-size: 11px; color: #A09B90; margin-top: 4px; display: inline-block;">
                You received this email because you voluntarily submitted feedback on Beyanco.
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return dispatchEmail({
    type: "feedback_user_thank_you",
    submissionId: entry.id,
    to: entry.contactEmail,
    subject,
    html,
    text: plainText,
    payloadSummary: {
      id: entry.id,
      name: entry.contactName,
      email: entry.contactEmail,
    },
  });
}

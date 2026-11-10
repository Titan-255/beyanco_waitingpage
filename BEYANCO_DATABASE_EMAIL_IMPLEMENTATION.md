# Beyanco AI — Database & Email Implementation Report

## Executive Summary
This document outlines the architecture and implementation details for persistent data storage and automatic transactional email dispatch across the **Beyanco AI** waitlist website, customer feedback survey, and popup modals.

---

## 1. Storage & Persistence Architecture

### Storage Mechanism
- **Engine**: Persistent JSON document storage (`data/waitlist_users.json`, `data/feedback_responses.json`, `data/email_outbox.json`) backed by file atomic sync with fallback to `/tmp/` in read-only/serverless hosting environments (e.g., Vercel / AWS Lambda).
- **Independence Guarantee**: Database persistence occurs **first** before any email dispatch is attempted. A failure or timeout in the email delivery provider does not invalidate or discard the recorded user submission.

### Tables / Collections
1. **`waitlist_users`**
   - Fields: `id`, `name`, `email`, `mobile_number`, `professionalRole`, `company`, `country`, `city`, `marketingConsent`, `source`, `utm`, `email_notification_status`, `user_confirmation_status`, `createdAt`, `updatedAt`.
   - **Duplicate Handling**: Unique index emulation on normalized, lowercase email (`email.trim().toLowerCase()`). When an existing email is re-submitted:
     - No duplicate record is created.
     - Existing user data is safely preserved.
     - Returns HTTP 201 with a friendly `"Welcome back! Your early-access preference has been updated."` message.

2. **`feedback_responses`**
   - Fields: `id`, `q1_user_type`, `q2_buying_timeline`, `q3_where_buy` (Array), `q4_hardest_part` (Array), `q5_regret_experience`, `q6_usefulness_rating` (1-5), `q7_ranked_features` (Ordered Array), `q8_comfort_factors` (Array), `q9_budget_spend`, `q10_one_thing_perfect`, `contactName`, `contactPhone`, `contactEmail`, `marketingConsent`, `interviewInterest`, `utm`, `notification_email_status`, `respondent_confirmation_status`, `createdAt`.
   - Supports anonymous responses (optional contact information).

3. **`email_outbox`**
   - Idempotent queue for recording pending, queued, or dispatched emails with submission ID references and retry timestamps.

---

## 2. Email Service Architecture

### Transactional Engine
- **Provider**: Resend API integration (`https://api.resend.com/emails`) via backend service module `src/lib/email-service.ts`.
- **Environment Variables**:
  - `RESEND_API_KEY`: API key for authentication.
  - `FROM_EMAIL`: Verified sender email (e.g. `Beyanco <updates@beyanco.com>`).
  - `ADMIN_NOTIFICATION_EMAIL`: Internal destination address (`akash@beyanco.com`).

### Notification Types
1. **Waitlist Admin Notification (`akash@beyanco.com`)**:
   - Subject: `New Beyanco Waitlist Registration`
   - Formatted HTML & plain-text with submitted name, email, mobile, role, location, company, consent status, timestamp, and ID.
2. **Waitlist User Confirmation**:
   - Subject: `You're on the Beyanco Waitlist!`
   - Professional welcome email explaining the vision and early access updates.
3. **Feedback Admin Notification (`akash@beyanco.com`)**:
   - Subject: `New Beyanco Customer Feedback Submission`
   - Formatted HTML with contact details, all 10 question responses (including ranked list for Q7 and full text for Q10), and consent flags.
4. **Feedback Respondent Thank-You**:
   - Subject: `Thank You for Sharing Your Thoughts with Beyanco!`
   - Sent only when the respondent voluntarily provides an email address. If submitted anonymously, the respondent email is cleanly skipped (`status: "skipped"`).

### Fallback & Outbox Mechanism
- In development or before production Resend credentials are added, emails are automatically safely queued into `data/email_outbox.json` (`status: "queued"`), ensuring no unhandled promise rejections or blocked HTTP responses.
- Once valid production credentials are supplied, the queue sends via standard HTTPS dispatch.

---

## 3. Security & Validation
- **Input Sanitization**: Strip non-standard characters from phone numbers, HTML-encode user inputs in email templates to prevent HTML injection.
- **Rate Limiting**: IP-based rate limiting protecting `/api/v1/waitlist` and `/api/v1/feedback`.
- **Honeypot Fields**: Transparent spam trap protection (`website_trap`, `hp_field`).
- **Separation of Consent**: Transactional confirmations do not opt users into general marketing unless `marketingConsent` was explicitly checked.

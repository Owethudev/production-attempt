// ────────────────────────────────────────────────────────────────
// Email Template: Email Verification
// ────────────────────────────────────────────────────────────────
// This file generates the HTML email sent to users when they
// register or request a new verification link.
//
// The template is a standalone function so it can be tested,
// reused, and swapped without touching the email-sending logic.
// It follows the Single Responsibility Principle: its only job
// is to produce an HTML string from input data.
//
// The design keeps branding and copy in one place so marketing
// or UX changes never require touching the gateway or service layer.

/**
 * Generates a fully self-contained HTML email for email verification.
 *
 * @param verificationUrl - The full URL the user clicks to verify their email.
 *                          Example: "https://frontend.com/verify-email?token=xxx"
 * @returns An HTML string ready to be sent via Resend (or any provider).
 */
export const buildVerificationEmailHtml = (verificationUrl: string): string => {
  // The HTML is inlined (no external CSS dependencies) so it renders
  // consistently across Gmail, Outlook, Apple Mail, and other clients.
  // Production email design best practices:
  //   - Tables for layout (widest compatibility)
  //   - Inline styles (most email clients strip <style> blocks)
  //   - Fallback fonts (Arial/Helvetica for broad support)
  //   - Clear call-to-action button
  //   - Plain-text fallback link below the button
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <!-- ── Card container ── -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                Portfolio Social Platform
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="margin:0 0 12px;color:#18181b;font-size:20px;font-weight:600;">
                Verify your email address
              </h2>
              <p style="margin:0 0 20px;color:#52525b;font-size:15px;line-height:1.6;">
                Thanks for joining! Please confirm your email address by clicking the button below.
                This link expires in <strong>24 hours</strong>.
              </p>
              <!-- Call-to-action button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;padding:0;">
                    <a href="${verificationUrl}"
                       target="_blank"
                       rel="noopener noreferrer"
                       style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Fallback plain-text link -->
              <p style="margin:0 0 8px;color:#71717a;font-size:13px;line-height:1.5;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 0;color:#6366f1;font-size:13px;word-break:break-all;">
                ${verificationUrl}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;background-color:#fafafa;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;">
                If you did not create an account, you can safely ignore this email.
                <br />
                &copy; ${new Date().getFullYear()} Portfolio Social Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
};
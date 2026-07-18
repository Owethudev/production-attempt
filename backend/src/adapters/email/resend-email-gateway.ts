// ────────────────────────────────────────────────────────────────
// Adapter: Resend Email Gateway
// ────────────────────────────────────────────────────────────────
// This file implements the EmailGateway interface using the Resend
// SDK (https://resend.com). It lives in the adapters layer because
// it bridges the domain's email abstraction to a concrete provider.
//
// Design decisions:
//   - Dependency Inversion: the use case layer depends on the
//     EmailGateway interface, not on this class. Swapping to Brevo
//     or SendGrid later requires only a new adapter class.
//   - Single Responsibility: this class only sends emails. It does
//     not generate tokens, build URLs, or enforce business rules.
//   - Error handling: Resend errors are caught and logged so the
//     caller (auth service) can decide how to respond (e.g., return
//     a user-friendly error instead of a 500).
//
// Security notes:
//   - The API key is injected via the constructor (from env), never
//     hardcoded or logged.
//   - Email content is constructed from trusted server-side values,
//     not from user input, preventing injection in email fields.

import { Resend } from 'resend';
import type { EmailGateway, EmailGatewayConfig, SendVerificationEmailInput, SendPasswordResetEmailInput } from './email-gateway.js';
import { buildVerificationEmailHtml } from './templates/verification-email.js';
import { logger } from '../../config/logger.js';

/**
 * Concrete email gateway that sends transactional emails via Resend.
 *
 * @remarks
 * The Resend SDK is initialised once in the constructor and reused
 * for every send call. This avoids re-authenticating on each request.
 */
export class ResendEmailGateway implements EmailGateway {
  /** The underlying Resend client instance. */
  private readonly resend: Resend;

  /** The verified sender address (e.g. "no-reply@yourdomain.com"). */
  private readonly from: string;

  /** The base URL of the front-end, used to build verification links. */
  private readonly clientUrl: string;

  constructor(config: EmailGatewayConfig) {
    // Initialise the Resend SDK with the API key from environment config.
    // The SDK handles retries and timeouts internally for transient failures.
    this.resend = new Resend(config.apiKey);
    this.from = config.from;
    this.clientUrl = config.clientUrl;

    logger.info({ from: this.from }, 'Resend email gateway initialised');
  }

  /**
   * Sends an email verification message to a newly registered user.
   *
   * @param input - Contains the recipient email and the verification URL.
   *
   * Flow:
   *   1. Build the HTML email from the template.
   *   2. Call the Resend API to send the email.
   *   3. Log success or failure (without exposing the token).
   */
  public async sendVerificationEmail(input: SendVerificationEmailInput): Promise<void> {
    const { to, verificationUrl } = input;

    // Build the HTML email body using our template function.
    // The template is a pure function — easy to unit-test in isolation.
    const html = buildVerificationEmailHtml(verificationUrl);

    try {
      // Send the email via Resend's `emails.send` API.
      // The `to` field can be a single address or an array.
      // We use a single recipient here for simplicity.
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject: 'Verify your email address — Portfolio Social Platform',
        html,
      });

      // Resend returns an error object in the response on failure
      // (rather than throwing). We check and throw manually so our
      // error-handling middleware can catch it consistently.
      if (error) {
        logger.error({ emailError: error, to }, 'Resend sendVerificationEmail failed');
        throw new Error(`Failed to send verification email: ${error.message}`);
      }

      logger.info({ to }, 'Verification email sent successfully');
    } catch (err) {
      // Log the failure with enough context to debug, but never log
      // the full verification URL (which contains the token).
      logger.error({ err, to }, 'Exception in sendVerificationEmail');
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }

  /**
   * Sends a password reset email (placeholder for future implementation).
   *
   * @param input - Contains the recipient email and the reset URL.
   */
  public async sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void> {
    const { to, resetUrl } = input;

    // TODO: Implement password reset email template and sending logic.
    // This will follow the same pattern as sendVerificationEmail above.
    logger.info({ to, resetUrl }, 'Password reset email would be sent here');

    // For now, this is a no-op to satisfy the interface contract.
    // The full implementation will be added when the forgot-password
    // and reset-password flows are implemented.
    return Promise.resolve();
  }
}
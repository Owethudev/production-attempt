// This file defines an interface for email delivery so authentication flows remain decoupled from any one provider.
// The design follows the Dependency Inversion Principle and the Repository Pattern in spirit: the use case depends on an abstraction rather than Resend/Brevo directly.
// It is intentionally lightweight because this request is for module design, not implementation details.

export interface EmailGateway {
  sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>;
  sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void>;
}

export interface SendVerificationEmailInput {
  to: string;
  verificationUrl: string;
}

export interface SendPasswordResetEmailInput {
  to: string;
  resetUrl: string;
}

export interface EmailGatewayConfig {
  apiKey: string;
  from: string;
  clientUrl: string;
}

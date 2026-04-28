import nodemailer from "nodemailer";

type OnboardingSubmissionEmailInput = {
  email: string;
  fullName: string;
};

export async function sendOnboardingSubmissionEmail({
  email,
  fullName,
}: OnboardingSubmissionEmailInput): Promise<void> {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn(
      "Skipping onboarding confirmation email: EMAIL_USER or EMAIL_PASS is not configured.",
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <h2 style="font-size: 24px; margin-bottom: 16px;">Onboarding Submission Received</h2>
      <p style="font-size: 15px; line-height: 1.6;">Dear ${fullName},</p>
      <p style="font-size: 15px; line-height: 1.6;">
        Your onboarding has been successfully submitted. Our team will review your information and get back to you soon.
      </p>
      <p style="font-size: 15px; line-height: 1.6;">
        What happens next:
      </p>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li>Your details are currently in review.</li>
        <li>You may receive a follow-up email if additional information is required.</li>
        <li>Once reviewed, we will contact you with the next steps.</li>
      </ul>
      <p style="font-size: 13px; color: #6b7280; margin-top: 24px;">
        This is an automated message from Digital Logbook.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Onboarding submission received",
    html: htmlContent,
  });
}
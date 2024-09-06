type EmailTemplateProps = {
  name: string;
  password: string;
  loginUrl: string;
};

export const EmailTemplate = ({
  name,
  password,
  loginUrl
}: EmailTemplateProps) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Digital Logbook!</h2>
        <p style="margin-bottom: 20px;">Dear ${name},</p>
        <p style="margin-bottom: 20px;">Thank you for joining us! We're excited to have you on board and look forward to working together.</p>
        <p style="margin-bottom: 20px;">Your temporary password is:</p>
        <div style="background-color: #f7f7f7; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
          <strong>${password}</strong>
        </div>
        <p style="margin-bottom: 20px;">Use this password to log in to your account. We recommend changing it once you have successfully logged in.</p>
        <p style="margin-bottom: 20px;">
          To access the application, please use the following link:
          <a href="${loginUrl}" style="color: #1a73e8;">Go to Application</a>
        </p>
        <p style="margin-bottom: 20px;">If you have any questions, feel free to contact our support team.</p>
      </div>
    `;
};

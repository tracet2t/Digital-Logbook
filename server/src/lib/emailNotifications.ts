import nodemailer from "nodemailer";

interface ActivitySubmissionNotification {
  mentorEmails: string[];
  studentName: string;
  taskDate: string;
}

export async function sendActivitySubmissionNotification({
  mentorEmails,
  studentName,
  taskDate,
}: ActivitySubmissionNotification): Promise<void> {
  if (!mentorEmails || mentorEmails.length === 0) {
    console.log("No mentor emails to send notification to");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const formattedDate = new Date(taskDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Task Submission</h2>
      <p style="color: #666; font-size: 16px;">
        <strong>${studentName}</strong> has submitted a task for:
      </p>
      <p style="color: #000; font-size: 18px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <strong>Date:</strong> ${formattedDate}
      </p>
      <p style="color: #666; font-size: 14px;">
        Please log in to your account to review the submission.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This is an automated notification from Digital Logbook.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: mentorEmails.join(","),
    subject: `New Task Submission: ${studentName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${mentorEmails.length} mentor(s)`);
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
}
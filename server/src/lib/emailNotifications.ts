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

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn(
      "Skipping activity submission email: EMAIL_USER or EMAIL_PASS is not configured.",
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
    from: emailUser,
    to: mentorEmails.join(","),
    subject: `New Task Submission: ${studentName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${mentorEmails.length} mentor(s)`);
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

interface ReviewReminderNotification {
  mentorEmail: string;
  mentorName: string;
  items: Array<{
    studentName: string;
    status: "Missed" | "Pending";
    dateLabel: string;
  }>;
}

export async function sendReviewReminderNotification({
  mentorEmail,
  mentorName,
  items,
}: ReviewReminderNotification): Promise<void> {
  if (!mentorEmail) {
    console.log("No mentor email provided for review reminder");
    return;
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn(
      "Skipping review reminder email: EMAIL_USER or EMAIL_PASS is not configured.",
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

  const listItems = items
    .map(
      (item) =>
        `<li style="margin-bottom: 6px;">
          <strong>${item.studentName}</strong> - ${item.status} (${item.dateLabel})
        </li>`,
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Pending Reviews Reminder</h2>
      <p style="color: #666; font-size: 16px;">
        Hi ${mentorName}, you have pending activity reviews that need your attention.
      </p>
      <ul style="color: #333; font-size: 14px; padding-left: 18px;">
        ${listItems}
      </ul>
      <p style="color: #666; font-size: 14px;">
        Please log in to your account to review these submissions.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This is an automated notification from Digital Logbook.
      </p>
    </div>
  `;

  const mailOptions = {
    from: emailUser,
    to: mentorEmail,
    subject: "Pending Reviews Reminder",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Review reminder sent to ${mentorEmail}`);
  } catch (error) {
    console.error("Error sending review reminder email:", error);
  }
}

import nodemailer from "nodemailer";

export async function GET() {
  return new Response("Hello Asky");
}

export async function POST(req) {
  try {
    const { email, name, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Hello ${name}, here is your message!`,
      text: message, // Plain text fallback
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9fafb; color: #4b5563; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
                <h1 style="font-size: 24px; margin: 0;">Hello ${name}!</h1>
              </div>
              <div style="padding: 20px;">
                <p style="margin: 0; font-size: 16px;">${message}</p>
                <p style="margin-top: 20px; font-size: 16px;">Thank you for reaching out. We will get back to you soon.</p>
              </div>
              <div style="background-color: #f1f5f9; text-align: center; padding: 10px; font-size: 14px;">
                <p style="margin: 0;">© 2024 Your Company. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

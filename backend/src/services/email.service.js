import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.EMAIL_USER || "techmonsterx6@gmail.com";
const SENDER_NAME = "Tech Monster";

// Helper function to send email via Brevo REST API (100% Error-Free)
const sendBrevoEmail = async (payload) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY environment variable is missing.");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send email via Brevo API");
  }

  return data;
};

// 1. VERIFY OTP EMAIL
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP email to ${email}...`);

    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Verify Your Email - Tech Monster",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Email Verification</h2>
          <p style="color: #555555;">Your verification code is:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px; background: #f0f4ff; padding: 10px; display: inline-block; border-radius: 4px;">${otp}</h1>
          <p style="color: #555555;">This OTP will expire in <b>10 minutes</b>.</p>
          <p style="color: #888888; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `
    };

    const data = await sendBrevoEmail(payload);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return data;
  } catch (error) {
    console.error("❌ OTP EMAIL ERROR:", error.message);
    throw error;
  }
};

// 2. RESET PASSWORD OTP EMAIL
export const sendResetPasswordOTP = async (email, otp) => {
  try {
    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Reset Your Password - Tech Monster",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Password Reset Request</h2>
          <p style="color: #555555;">Your password reset OTP is:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px; background: #f0f4ff; padding: 10px; display: inline-block; border-radius: 4px;">${otp}</h1>
          <p style="color: #555555;">This OTP will expire in <b>10 minutes</b>.</p>
          <p style="color: #888888; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #333333; font-weight: bold;">Tech Monster Pvt. Ltd.</p>
        </div>
      `
    };

    const data = await sendBrevoEmail(payload);
    console.log(`✅ Reset Password email sent to ${email}`);
    return data;
  } catch (error) {
    console.error("❌ Reset Password Email Error:", error.message);
    throw error;
  }
};

// 3. APPLICATION STATUS EMAIL
export const sendApplicationStatusEmail = async (email, status) => {
  try {
    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Application Status Updated - Tech Monster",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Application Status</h2>
          <p style="color: #555555;">Your application status has been updated.</p>
          <h3 style="color: #2563eb;">Status: ${status}</h3>
          <p style="color: #555555;">Thank you for using Tech Monster.</p>
        </div>
      `
    };

    const data = await sendBrevoEmail(payload);
    console.log(`✅ Application status email sent to ${email}`);
    return data;
  } catch (error) {
    console.error("❌ Application Status Email Error:", error.message);
    throw error;
  }
};

// 4. CERTIFICATE EMAIL WITH ATTACHMENT
export const sendCertificateEmail = async (email, pdfPath) => {
  try {
    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      subject: "🎉 Internship Completion Certificate - Tech Monster",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Congratulations 🎉</h2>
          <p style="color: #555555;">Your internship has been successfully completed.</p>
          <p style="color: #555555;">Your Internship Completion Certificate is attached with this email.</p>
          <br>
          <p style="color: #555555;">Best Wishes,</p>
          <p style="color: #333333; font-weight: bold;">Tech Monster Pvt. Ltd.</p>
        </div>
      `
    };

    if (pdfPath && fs.existsSync(pdfPath)) {
      const fileContent = fs.readFileSync(pdfPath).toString("base64");
      payload.attachment = [
        {
          name: "Internship-Certificate.pdf",
          content: fileContent,
        },
      ];
    }

    const data = await sendBrevoEmail(payload);
    console.log(`✅ Certificate email sent to ${email}`);
    return data;
  } catch (error) {
    console.error("❌ Certificate Email Error:", error.message);
    throw error;
  }
};
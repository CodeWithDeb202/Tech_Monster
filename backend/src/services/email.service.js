import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.EMAIL_USER || "techmonsterx6@gmail.com";
const SENDER_NAME = "Tech Monster";

const formatDate = (date = new Date()) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const getStudentName = (student = {}) =>
  [student.firstName, student.lastName].filter(Boolean).join(" ") ||
  student.username ||
  "Student";

const buildTemplate = ({ heading, intro, details = [], note }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #1a1a1a; margin-bottom: 12px;">${heading}</h2>
    <p style="color: #555555; line-height: 1.6;">${intro}</p>
    ${details.length
    ? `<div style="background: #f8fafc; border-radius: 6px; padding: 14px; margin: 18px 0;">
        ${details.map((item) => `
          <p style="margin: 6px 0; color: #374151;">
            <b>${item.label}:</b> ${item.value || "N/A"}
          </p>
        `).join("")}
      </div>`
    : ""}
    ${note ? `<p style="color: #555555; line-height: 1.6;">${note}</p>` : ""}
    <p style="color: #333333; font-weight: bold; margin-top: 24px;">Tech Monster Pvt. Ltd.</p>
  </div>
`;

export const sendActivityEmail = async ({ to, subject, heading, intro, details, note }) => {
  const payload = {
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: buildTemplate({ heading, intro, details, note })
  };

  return sendBrevoEmail(payload);
};

export const sendWelcomeEmail = (student) =>
  sendActivityEmail({
    to: student.email,
    subject: "Welcome to Tech Monster",
    heading: "Welcome to Tech Monster",
    intro: `Hi ${getStudentName(student)}, your account has been created successfully.`,
    note: "Verify your email and start learning with your dashboard."
  });

export const sendInternshipJoinedEmail = ({ student, internship, enrollment }) =>
  sendActivityEmail({
    to: student.email,
    subject: "Internship Enrollment Successful",
    heading: "Internship Enrollment Successful",
    intro: `Hi ${getStudentName(student)}, you have successfully joined an internship.`,
    details: [
      { label: "Internship", value: internship.title },
      { label: "Duration", value: internship.duration },
      { label: "Start Date", value: formatDate(enrollment.startedAt || enrollment.createdAt) }
    ]
  });

export const sendCourseJoinedEmail = ({ student, course, enrollment }) =>
  sendActivityEmail({
    to: student.email,
    subject: "Course Enrollment Successful",
    heading: "Course Enrollment Successful",
    intro: `Hi ${getStudentName(student)}, you have successfully joined a course.`,
    details: [
      { label: "Course", value: course.title },
      { label: "Duration", value: course.duration },
      { label: "Enrollment Date", value: formatDate(enrollment.startedAt || enrollment.createdAt) }
    ]
  });

export const sendLessonCompletedEmail = ({ student, title, lessonName, progress, type = "course" }) =>
  sendActivityEmail({
    to: student.email,
    subject: "Lesson Completed",
    heading: "Lesson Completed",
    intro: `Great work, ${getStudentName(student)}. You completed a lesson in your ${type}.`,
    details: [
      { label: type === "internship" ? "Internship" : "Course", value: title },
      { label: "Lesson", value: lessonName },
      { label: "Progress", value: `${progress || 0}%` }
    ]
  });

export const sendAllLessonsCompletedEmail = ({ student, title, type = "course" }) =>
  sendActivityEmail({
    to: student.email,
    subject: "All Lessons Completed",
    heading: "All Lessons Completed",
    intro: `Congratulations ${getStudentName(student)}, you have completed all lessons.`,
    details: [
      { label: type === "internship" ? "Internship" : "Course", value: title },
      { label: "Completion Date", value: formatDate() },
      { label: "Progress", value: "100%" }
    ]
  });

export const sendTaskCompletedEmail = ({ student, title, taskTitle, type = "course" }) =>
  sendActivityEmail({
    to: student.email,
    subject: "Task Completed",
    heading: "Task Completed",
    intro: `Nice work, ${getStudentName(student)}. Your task has been submitted for review.`,
    details: [
      { label: type === "internship" ? "Internship" : "Course", value: title },
      { label: "Task", value: taskTitle },
      { label: "Status", value: "Submitted" }
    ]
  });

export const sendAllTasksCompletedEmail = ({ student, title, type = "course", progress = 100 }) =>
  sendActivityEmail({
    to: student.email,
    subject: "All Tasks Completed",
    heading: "All Tasks Completed",
    intro: `Congratulations ${getStudentName(student)}, all required tasks are complete.`,
    details: [
      { label: type === "internship" ? "Internship" : "Course", value: title },
      { label: "Completion Date", value: formatDate() },
      { label: "Progress", value: `${progress}%` }
    ]
  });

export const sendProgramCompletedEmail = ({ student, title, type = "course", certificateAvailable = false }) =>
  sendActivityEmail({
    to: student.email,
    subject: `${type === "internship" ? "Internship" : "Course"} Completed`,
    heading: `Congratulations! ${type === "internship" ? "Internship" : "Course"} Completed`,
    intro: `Hi ${getStudentName(student)}, you have completed your ${type}.`,
    details: [
      { label: type === "internship" ? "Internship" : "Course", value: title },
      { label: "Completion Date", value: formatDate() },
      { label: "Certificate", value: certificateAvailable ? "Available after issue" : "Not available" }
    ]
  });

export const safeSendActivityEmail = (label, sendEmail) => {
  Promise.resolve()
    .then(sendEmail)
    .catch((error) => {
      console.error(`[EMAIL] Failed to send ${label}:`, error.message);
    });
};

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

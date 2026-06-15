import nodemailer from "nodemailer";
import { env } from "./env.js";
export const sendMail = async (email: string, htmlContent: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ECOMMERCE" <${env.SMTP_USER}>`,
      to: email,
      subject: "ECOMMERCE",
      html: htmlContent,
    });

    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

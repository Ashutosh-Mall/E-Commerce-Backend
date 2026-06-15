export const emailContent = (otp: string): string => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb;">

    <div style="background: #111827; padding: 20px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0;">E-Commerce Platform</h2>
    </div>

    <div style="padding: 30px; text-align: center;">
      <h3 style="color: #111827;">Your OTP Code</h3>

      <p style="color: #6b7280; font-size: 14px;">
        Use the following OTP to verify your account. This code will expire in <b>5 minutes</b>.
      </p>

      <div style="margin: 25px 0;">
        <span style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; background: #f3f4f6; padding: 12px 20px; border-radius: 8px; color: #111827;">
          ${otp}
        </span>
      </div>

      <p style="color: #9ca3af; font-size: 12px;">
        If you did not request this, please ignore this email.
      </p>
    </div>

    <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
      © 2026 E-Commerce Platform. All rights reserved.
    </div>

  </div>
</div>
  `;
};

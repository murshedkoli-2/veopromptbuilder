import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Early check for credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not defined in environment variables. Email features will fail.');
}

export async function sendOtpEmail(email: string, otp: string, type: 'verification' | 'reset') {
  const subject = type === 'verification' ? 'Verify your account' : 'Reset your password';
  const text = type === 'verification'
    ? `Your verification code is: ${otp}. It will expire in 10 minutes.`
    : `Your password reset code is: ${otp}. It will expire in 10 minutes.`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded: 10px;">
      <h2 style="color: #333; text-align: center;">${subject}</h2>
      <p style="font-size: 16px; color: #555; text-align: center;">Use the code below to ${type === 'verification' ? 'verify your account' : 'reset your password'}:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; margin: 30px 0; color: #0070f3; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #888; text-align: center;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Veo Prompt Maker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

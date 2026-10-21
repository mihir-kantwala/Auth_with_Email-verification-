import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=` +
    encodeURIComponent(token);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    text: `Open this link to verify your email: ${verificationUrl}`,
    html: `<h2>Verify your email address</h2>
      <p>Click the button below to activate your account.</p>
      <a href="${verificationUrl}"
         style="display:inline-block;padding:12px 20px;
                background:#2563eb;color:white;
                text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not create an account, ignore this email.</p>
    `,
  });
}

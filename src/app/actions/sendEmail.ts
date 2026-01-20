import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: "hr1411687@gmail.com",
    pass: "zgvjxhbmpqplmmxr",
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailParams) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}

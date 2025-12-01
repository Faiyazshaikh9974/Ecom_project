import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,     // your email
      pass: process.env.SMTP_PASSWORD,  // app password
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

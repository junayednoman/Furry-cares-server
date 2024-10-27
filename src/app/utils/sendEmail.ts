import nodemailer from "nodemailer";
import config from "../config";
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: 465,
    secure: config.node_env === "production", // true for port 465, false for other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_pass,
    },
  });

  await transporter.sendMail({
    from: config.sender_email, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

}
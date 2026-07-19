import nodemailer from "nodemailer";
import { EMAILPASS, USEREMAIL } from "../../Configs/config.service.js";
export const sendEmail = async ({
  to,
  text,
  subject,
  html,
  cc,
  bcc,
  attachments,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USEREMAIL,
      pass: EMAILPASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"Sara7a App"  <${USEREMAIL}>`,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      attachments,
    });
  } catch (error) {
    console.log(`error while sending :${error}`);
  }
};

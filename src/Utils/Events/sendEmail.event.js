import { EventEmitter } from "node:events";
import { generateOtpTemplate } from "../emails/HTMLtemplate.js";
import { sendEmail } from "../emails/email.utils.js";

export const sendEmailEvent = new EventEmitter();

sendEmailEvent.on("confirmEmail", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      subject: data.subject,
      html: generateOtpTemplate({
        firstname: data.firstname,
        email: data.to,
        otp: data.otp,
      }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

sendEmailEvent.on("sendEmail", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      subject: data.subject,
      text: data.text,
    });
  } catch (error) {
    console.log("error", error);
  }
});

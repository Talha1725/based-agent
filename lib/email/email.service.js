const nodemailer = require("nodemailer");
import { signupResetPasswordTemplate } from "./templates/signup";

export async function sendEmail(email, code) {
  try {
    await sendEmailVerification(email, code);
  } catch (err) {
    console.log("=== ERR IN EMAIL SERVICE ====", err);
  }
}

const sendEmailVerification = async (email, code) => {
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "mail.xnerds.co",
      secure: true,
      port: 465,
      auth: {
        user: "team@basedagents.co",
        pass: "fNjXDcV6NLGEHtm",
      },
    });
    const html = signupResetPasswordTemplate(email, code);
    const mailOptions = {
      from: {
        name: "Based Agent",
        address: "team@basedagents.co",
      },
      to: email,
      subject: `Verify Your Email Address - Based Agents`,
      html: html,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("=== email response ====", response);
    return true;
  } catch (err) {
    console.log(err);
  }
};

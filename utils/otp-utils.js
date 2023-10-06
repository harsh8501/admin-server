import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "harshkushwah85@gmail.com",
      pass: "xxxx xxxx xxxx xxxx",
    },
  });

  const mailOptions = {
    from: "harshkushwah85@gmail.com",
    to: to,
    subject: subject,
    text: `Your Otp for verification: ${otp}. This Otp will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
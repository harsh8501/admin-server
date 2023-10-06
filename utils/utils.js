import crypto from "crypto";

import { sendOtpEmail } from "./otp-utils.js";
import conn from "../connection/db.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const hashOtp = (otp) => {
  const hash = crypto.createHash("sha256");
  hash.update(otp.toString());
  return hash.digest("hex");
};

export const sendOtpVerificationEmail = async (email, subject) => {
  try {
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    //storing hash otp to DB
    const data = {
      email,
      opt: hashedOtp,
      createdAt: Date.now().toString(),
      expiresAt: `${Date.now() + 300000}`,
    };
    conn.query("Insert into otp SET ?", data, (err, result, fileds) => {
      if (err) {
        throw new Error(err);
      }
    });

    //sending Email
    await sendOtpEmail(email, subject, otp);
  } catch (error) {
    console.log(error.message);
  }
};

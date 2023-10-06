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


//Check OTP
const checkOtp = async (hashedOtp, originalOtp) => {
  const hashedOtp_2 = hashOtp(originalOtp);
  if (hashedOtp === hashedOtp_2) {
    return true;
  } else {
    return false;
  }
};

//Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    // Check OTP
    const userOtpRecord = await new Promise((resolve, reject) => {
      conn.query("SELECT * FROM otp WHERE email=?", [email], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });

    if (!userOtpRecord || userOtpRecord.length === 0) {
      return {
        verified: false,
        message: `Account record doesn't exist or has been verified already. Please sign up.`,
      };
    }

    const hashOtp = userOtpRecord[0].opt;
    const otpExpiredDate = userOtpRecord[0].expiresAt;

    if (parseInt(otpExpiredDate) < Date.now()) {
      // OTP expired
      conn.query("DELETE FROM otp WHERE email=?", [email], (err, result) => {
        if (err) {
          console.log(err.message);
        }
      });
      return {
        verified: false,
        message: `OTP has expired. Please try again.`,
      };
    } else {
      // Check for valid OTP
      const validOtp = await checkOtp(hashOtp, otp);
      if (!validOtp) {
        return {
          verified: false,
          message: `OTP is not valid. Please try again.`,
        };
      } else {
        conn.query("DELETE FROM otp WHERE email=?", [email], (err, result) => {
          if (err) {
            console.log(err.message);
          }
        });
        return {
          verified: true,
          message: `User Account Verified Successfully.`,
        };
      }
    }
  } catch (error) {
    return {
      verified: false,
      message: error.message,
    };
  }
};

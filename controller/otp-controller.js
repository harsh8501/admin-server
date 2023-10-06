import { sendOtpVerificationEmail } from "../utils/utils.js";
import conn from "../connection/db.js";

const sendOTP = async (req, resp) => {
  try {
    const { username, subject } = req.body;
    if (!username || !subject) {
      throw new Error("Please provide all fields");
    }

    //check user
    const userExist = await new Promise((resolve, reject) => {
      conn.query(
        `SELECT * FROM admins WHERE username = ?`,
        [username],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
    
    if (userExist.length === 0) {
      resp.status(404).json("Admin not found with this username");
    }

    //send otp
    await sendOtpVerificationEmail(userExist[0].email, subject);
    resp.status(200).json({ message: "OTP send to your email id please check" });
  } catch (error) {
    resp.status(500).json(error.message);
  }
};

export default sendOTP;

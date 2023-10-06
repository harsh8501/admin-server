import bcrypt from "bcrypt";

import conn from "../connection/db.js";

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

//Register for admin
export const register = async (req, resp) => {
  try {
    const { email, username, password } = req.body;

    //check all fields
    if (!email || !username || !password) {
      throw new Error("Please provide all fields");
    }

    //check email
    if (!email.trim().includes("@gmail.com")) {
      resp.status(400).json("Please provide valid email address");
    }

    //check if admin already exist
    const checkUser = await new Promise((resolve, reject) => {
      conn.query(
        `SELECT * FROM admins WHERE email = ?`,
        [email],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });

    if (checkUser.length > 0) {
      resp.status(200).json("User Already Exist");
      return;
    } else {
      console.log("New User");
    }

    const checkUserName = await new Promise((resolve, reject) => {
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

    if (checkUserName.length > 0) {
      resp
        .status(200)
        .json("UserName Already Exist, Please use different username");
      return;
    }

    var hashPwd;
    await hashPassword(password)
      .then((hashedPassword) => {
        if (hashedPassword) {
          // Hashed password is available, proceed with further processing
          hashPwd = hashedPassword;
        } else {
          console.log("Password hashing failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const data = {
      email,
      username,
      password: hashPwd,
    };

    //creating User
    conn.query("Insert into admins SET ?", data, (err, result, fields) => {
      if (err) {
        throw new Error(err);
      }
    });

    resp.status(201).json({
      message: "Successfully account created",
      email: data.email,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};

//LogOut
export const logOut = (req, resp) => {
  try {
    req.logout((err) => {
      if (err) {
        return resp.status(500).json({ message: "Error logging out" });
      }
      resp.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};

//Update Password
export const updatePassword = async (req, resp) => {
  try {
    const { password } = req.body;

    var hashPwd;
    await hashPassword(password)
      .then((hashedPassword) => {
        if (hashedPassword) {
          // Hashed password is available, proceed with further processing
          hashPwd = hashedPassword;
        } else {
          console.log("Password hashing failed.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    conn.query(
      "Update admins SET password=? where id=?",
      [hashPwd, req.params.id],
      (err, result) => {
        if (err) {
          throw new Error(err);
        }
      }
    );
    resp
      .status(200)
      .json({ message: `Password Updated for id: ${req.params.id}` });
  } catch (error) {
    resp.status(500).json(error.message);
  }
};

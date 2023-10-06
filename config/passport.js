import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import conn from "../connection/db.js";


// Helper function to verify OTP
function verifyOTP(userId, done, admin) {
  // Implement your OTP verification logic here
  // You can query the OTP table for the user and verify the OTP
  // If the OTP is valid, call done(null, user) to indicate successful authentication
  // If the OTP is invalid, call done(null, false, { message: "Invalid OTP" })
  // You can customize this logic based on how you store and verify OTPs

  // Example:
  // conn.query("SELECT * FROM otp WHERE user_id = ? AND otp_code = ? AND expiry > NOW()", [userId, enteredOTP], (err, results) => {
  //   if (err) {
  //     return done(err);
  //   }
  //   if (results.length === 0) {
  //     return done(null, false, { message: "Invalid OTP" });
  //   }
     return done(null, admin);
  // });
}


// Configure the local strategy for Passport.js
passport.use(
  new LocalStrategy(
    { usernameField: "username" },
    (username, password, done) => {
      // Find a user by username in the database
      conn.query(
        "SELECT * FROM admins WHERE username = ?",
        [username],
        (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.length === 0) {
            return done(null, false, { message: "Incorrect username." });
          }

          const admin = results[0];

          // Compare the provided password with the hashed password in the database
          bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (!isMatch) {
              return done(null, false, { message: "Incorrect password." });
            }

            // If authentication is successful, return the admin
            //return done(null, admin);

            // If authentication is successful, continue with OTP verification
            return verifyOTP(admin.id, done, admin);
          });
        }
      );
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((admin, done) => {

   done(null, admin.id);

  // Include sessionIdentifier in the user object
  //done(null, { id: admin.id, sessionIdentifier: admin.sessionIdentifier });
});

passport.deserializeUser((id, done) => {
  // Retrieve the user from the database based on the user ID
  conn.query("SELECT * FROM admins WHERE id = ?", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    const admin = results[0];
    //admin.sessionIdentifier = user.sessionIdentifier; // Restore session identifier
    done(null, admin);
  });
});

export default passport;

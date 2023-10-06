import express from "express";
import crypto from 'crypto';

import passport from "../config/passport.js";
import { register, logOut, updatePassword } from "../controller/admin-controller.js";

const route = express.Router();

// Create an isAuthenticated middleware
function isAuthenticated(req, resp, next) {
  if (req.isAuthenticated()) {
    return next(); // admin is authenticated, proceed to the next middleware/route
  }
  resp.status(403).json({message: 'Please Login First'}) 
}

// Function to generate a random session identifier
function generateSessionIdentifier() {
  return crypto.randomBytes(16).toString('hex'); // Generates a 32-character hexadecimal token
}

function invalidateSession(sessionIdentifier) {
  // Implement your logic here to invalidate the session with the given sessionIdentifier
  // You might remove the session or mark it as expired in your database or session store
  // For example, if you are using a database to store sessions, you might delete the old session record
  // Example with a fictional database query:
  // db.query('DELETE FROM sessions WHERE sessionIdentifier = ?', [sessionIdentifier], (err, result) => {
  //   if (err) {
  //     console.error('Error invalidating session:', err);
  //   }
  //   console.log('Session invalidated successfully');
  // });
}

function updateUserSessionIdentifier(userId, newSessionIdentifier) {
  // Implement your logic here to update the user's session identifier in your database
  // For example, if you are using a database to store user information, you might update the user's sessionIdentifier field
  // Example with a fictional database query:
  // db.query('UPDATE users SET sessionIdentifier = ? WHERE id = ?', [newSessionIdentifier, userId], (err, result) => {
  //   if (err) {
  //     console.error('Error updating user session identifier:', err);
  //   }
  //   console.log('User session identifier updated successfully');
  // });
}


route.post("/register", register);
route.get("/logout",isAuthenticated, logOut);
route.post("/update-password/:id",isAuthenticated, updatePassword)

// Use passport.authenticate for login
route.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    // Generate a new session identifier (e.g., a random token)
    //const newSessionIdentifier = generateSessionIdentifier();

    // Store the new session identifier in the user's session
    //req.session.sessionIdentifier = newSessionIdentifier;

    // Check if the user has a previous session identifier
    /* if (user.sessionIdentifier) {
      // Invalidate the previous session if it exists
      invalidateSession(user.sessionIdentifier);
    } */

    // Update the user's session identifier in the database
    //updateUserSessionIdentifier(user.id, newSessionIdentifier);

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      // Redirect to the dashboard route on successful authentication
      return res.redirect("/api/admin/dashboard");
    });
  })(req, res, next);
});

export default route;

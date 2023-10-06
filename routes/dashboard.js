import express from "express";

const route = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, resp, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route
  }
  //resp.redirect("/api/admin/login");
  resp.status(403).json({ message: "Please Login First for Dashboard" });
}

//Now be like it after use in controller dashboard
// Dashboard route - protected
route.get("/dashboard", isAuthenticated, (req, resp) => {
  resp.status(200).json("Admin Dashboard");
});

export default route;

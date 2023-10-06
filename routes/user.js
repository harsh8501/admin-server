import express from "express";

import { getAllUser,updateUserById } from "../controller/user-controller.js";

const route = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, resp, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  resp.status(403).json({ message: "Please Login First" });
}

route.get("/get-user", isAuthenticated, getAllUser);
route.put("/update-user/:id",isAuthenticated, updateUserById);

export default route;

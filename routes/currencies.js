import express from "express";

import { getAllCurrency,updateCurrencyById } from "../controller/currency-controller.js";

const route = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, resp, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  resp.status(403).json({ message: "Please Login First" });
}

route.get("/get-currencies", isAuthenticated, getAllCurrency);
route.put("/update-currency/:id",isAuthenticated, updateCurrencyById);

export default route;

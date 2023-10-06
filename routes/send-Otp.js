import express from "express";

import sendOTP from "../controller/otp-controller.js";

const route = express.Router();

route.post("/send-otp",sendOTP);

export default route;
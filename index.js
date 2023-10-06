import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

import admin from "./routes/admin.js";
import dashboard from "./routes/dashboard.js";
import sendOtp from "./routes/send-Otp.js";
import user from './routes/user.js';
import currencies from './routes/currencies.js';

const app = express();

dotenv.config();

const corsOptions = {
  origin: "*",
  methods: "GET,POST,DELETE,PUT",
  optionsSuccessStatus: 200,
};
const PORT = process.env.PORT || 4010;

// Initialize express-session
app.use(
  session({
    secret: "harsh-kushwah",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/api/admin', // Restrict the session cookie to '/api/admin' and its subpaths
    },
  })
);

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/admin", admin);
app.use("/api/admin", dashboard);
app.use("/api/admin",sendOtp);
app.use('/api/admin',user);
app.use('/api/admin',currencies);

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);

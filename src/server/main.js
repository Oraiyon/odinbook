import express from "express";
import ViteExpress from "vite-express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import router from "./router.js";
import initializePassport from "./passport_config.js";
import cookieParser from "cookie-parser";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
    // store: new PrismaSessionStore(new PrismaClient(), {
    //   checkPeriod: 2 * 60 * 1000,
    //   dbRecordIdIsSessionId: true,
    //   dbRecordIdFunction: undefined
    // })
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.use(compression());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       "img-src": ["'self'", "https://res.cloudinary.com"]
//     }
//   })
// );
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, limit: 20 });
// app.use(limiter);

app.use("/", router);

ViteExpress.listen(app, 3000, () => console.log("Server is listening on port 3000..."));

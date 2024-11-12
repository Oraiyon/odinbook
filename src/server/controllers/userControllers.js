import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";

const prisma = new PrismaClient();

const signup = [
  body("username", "Invalid Username")
    .trim()
    .isLength({ min: 3 })
    .isLength({ max: 20 })
    .toLowerCase()
    .escape(),
  body("password", "Invalid Password").trim().isLength({ min: 6 }).toLowerCase().escape(),
  body("confirmPassword", "Confirm Password must match Password")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  expressAsyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const errors = validationResult(req);
        const usernameTaken = await prisma.user.findFirst({
          where: {
            username: req.body.username
          }
        });
        if (!errors.isEmpty() || usernameTaken) {
          res.status(200).json(false);
          return;
        }
        const user = await prisma.user.create({
          data: {
            username: req.body.username,
            password: hashedPassword
          }
        });
        res.status(200).json(true);
      }
    });
  })
];

export const login = [
  expressAsyncHandler(async (req, res, next) => {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username
      }
    });
    if (!user) {
      res.status(200).json(false);
      return;
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(200).json(false);
      return;
    }
    next();
  }),
  passport.authenticate("local"),
  (req, res, next) => {
    res.status(200).json(req.user);
  }
];

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export default signup;

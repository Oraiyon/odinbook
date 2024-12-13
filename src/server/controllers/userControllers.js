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
      },
      include: {
        FollowedBy: true,
        Following: true
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
  expressAsyncHandler(async (req, res, next) => {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username
      },
      include: {
        FollowedBy: true,
        Following: true
      }
    });
    res.status(200).json(user);
  })
];

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export const get_search_user = expressAsyncHandler(async (req, res, next) => {
  const searchUserList = await prisma.user.findMany({
    where: {
      username: {
        contains: req.params.username
      }
    },
    include: {
      FollowedBy: true,
      Following: true
    }
  });
  res.status(200).json(searchUserList);
});

export const get_user_profile = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id
    },
    include: {
      FollowedBy: true,
      Following: true
    }
  });
  res.status(200).json(user);
});

export default signup;

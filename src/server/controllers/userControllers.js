import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";
import multer from "multer";
import { unlink } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// dest starts from root directory
const upload = multer({ dest: "./src/server/public/uploads" });

cloudinary.config({
  // Put in Railway
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        if (!errors.isEmpty()) {
          res.status(200).json("User Creation Failed");
          return;
        }
        if (usernameTaken) {
          res.status(200).json("Username Already Taken");
          return;
        }
        await prisma.user.create({
          data: {
            username: req.body.username,
            password: hashedPassword
          }
        });
        res.status(200).json("User Created");
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
  expressAsyncHandler(async (req, res, next) => {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username
      },
      include: {
        Followers: {
          include: {
            receiver: {
              omit: {
                password: true
              }
            }
          },
          orderBy: {
            followedDate: "desc"
          }
        },
        Following: {
          include: {
            sender: {
              omit: {
                password: true
              }
            }
          },
          orderBy: {
            followedDate: "desc"
          }
        }
      },
      omit: {
        password: true
      }
    });
    res.status(200).json(user);
  })
];

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log("ERROR");
      return next(err);
    }
    res.status(200).json(true);
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
      Followers: {
        include: {
          receiver: {
            omit: {
              password: true
            }
          }
        }
      },
      Following: {
        include: {
          sender: {
            omit: {
              password: true
            }
          }
        }
      },
      Posts: true,
      Comments: true
    },
    omit: {
      password: true
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
      Followers: {
        include: {
          sender: {
            omit: {
              password: true
            }
          },
          receiver: {
            omit: {
              password: true
            }
          }
        },
        orderBy: {
          followedDate: "desc"
        }
      },
      Following: {
        include: {
          sender: {
            omit: {
              password: true
            }
          },
          receiver: {
            omit: {
              password: true
            }
          }
        },
        orderBy: {
          followedDate: "desc"
        }
      }
    },
    omit: {
      password: true
    }
  });
  res.status(200).json(user);
});

export const put_user_profile_username = [
  body("username", "Invalid Username")
    .trim()
    .isLength({ min: 3 })
    .isLength({ max: 20 })
    .toLowerCase()
    .escape(),
  expressAsyncHandler(async (req, res, next) => {
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
    const user = await prisma.user.update({
      where: {
        id: req.body.id
      },
      data: {
        username: req.body.username
      },
      include: {
        Followers: {
          include: {
            receiver: {
              omit: {
                password: true
              }
            }
          }
        },
        Following: {
          include: {
            sender: {
              omit: {
                password: true
              }
            }
          }
        }
      },
      omit: {
        password: true
      }
    });
    res.status(200).json(user);
  })
];

export const put_user_profile_picture = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    await cloudinary.uploader.destroy(req.body.id);
    const imageURL = await cloudinary.uploader.upload(req.file.path, {
      folder: "odinbook_profiles",
      public_id: req.body.id
    });
    await unlink(req.file.path);
    const user = await prisma.user.update({
      where: {
        id: req.body.id
      },
      data: {
        profilePicture: imageURL.secure_url
      },
      include: {
        Followers: {
          include: {
            receiver: {
              omit: {
                password: true
              }
            }
          }
        },
        Following: {
          include: {
            sender: {
              omit: {
                password: true
              }
            }
          }
        }
      },
      omit: {
        password: true
      }
    });
    res.status(200).json(user);
  })
];

export const put_user_default_picture = expressAsyncHandler(async (req, res, next) => {
  await cloudinary.uploader.destroy(req.body.id);
  const user = await prisma.user.update({
    where: {
      id: req.body.id
    },
    data: {
      profilePicture: null
    },
    include: {
      Followers: {
        include: {
          receiver: {
            omit: {
              password: true
            }
          }
        },
        orderBy: {
          followedDate: "desc"
        }
      },
      Following: {
        include: {
          sender: {
            omit: {
              password: true
            }
          }
        },
        orderBy: {
          followedDate: "desc"
        }
      }
    },
    omit: {
      password: true
    }
  });
  res.status(200).json(user);
});

export const put_user_password = [
  body("currentPassword", "Invalid Password").trim().isLength({ min: 6 }).toLowerCase().escape(),
  body("newPassword", "Invalid Password").trim().isLength({ min: 6 }).toLowerCase().escape(),
  body("confirmNewPassword", "Confirm Password must match Password")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    }),
  expressAsyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.newPassword, 10, async (err, hashedPassword) => {
      if (err) {
        return err;
      } else {
        const errors = validationResult(req);
        const user = await prisma.user.findFirst({
          where: {
            id: req.body.id
          }
        });
        const match = await bcrypt.compare(req.body.currentPassword, user.password);
        const inputErrors = {
          passwordLength: req.body.newPassword.length >= 6 ? true : false,
          passwordConfirm: req.body.newPassword === req.body.confirmNewPassword ? true : false,
          passwordMatch: match ? true : false
        };
        if (!errors.isEmpty() || !match) {
          res.status(200).json(inputErrors);
          return;
        }
        const updatedUser = await prisma.user.update({
          where: {
            id: req.body.id
          },
          data: {
            password: hashedPassword
          },
          include: {
            Followers: {
              include: {
                receiver: {
                  omit: {
                    password: true
                  }
                }
              }
            },
            Following: {
              include: {
                sender: {
                  omit: {
                    password: true
                  }
                }
              }
            }
          },
          omit: {
            password: true
          }
        });
        res.status(200).json(updatedUser);
      }
    });
  })
];

export const delete_user = [
  expressAsyncHandler(async (req, res, next) => {
    const [deletedLikes, deletedComments, deletedPosts, deleteFollows, deleteUser] =
      await prisma.$transaction([
        prisma.likes.deleteMany({
          where: {
            likedById: req.params.id
          }
        }),
        prisma.comment.deleteMany({
          where: {
            authorId: req.params.id
          }
        }),
        prisma.post.deleteMany({
          where: {
            authorId: req.params.id
          }
        }),
        prisma.follow.deleteMany({
          where: {
            senderId: req.params.id
          }
        }),
        prisma.follow.deleteMany({
          where: {
            receiverId: req.params.id
          }
        }),
        prisma.user.delete({
          where: {
            id: req.params.id
          }
        })
      ]);
    await cloudinary.uploader.destroy(req.params.id);
    const path = req.path.split("/");
    if (path[1] === "admin") {
      res.status(200).json(true);
      return;
    } else {
      next();
    }
  }),
  logout
];

export const admin_get_users = expressAsyncHandler(async (req, res, next) => {
  const userList = await prisma.user.findMany({
    include: {
      Posts: {
        orderBy: {
          postDate: "desc"
        },
        include: {
          Likes: {
            include: {
              likedBy: true
            }
          },
          Comments: {
            include: {
              author: {
                omit: {
                  password: true
                }
              }
            }
          },
          author: {
            omit: {
              password: true
            }
          }
        }
      },
      Comments: {
        orderBy: {
          commentDate: "desc"
        }
      }
    },
    omit: {
      password: true
    }
  });
  res.status(200).json(userList);
});

export const get_user_inbox = expressAsyncHandler(async (req, res, next) => {
  const inboxList = await prisma.follow.findMany({
    skip: 0,
    take: 25,
    where: {
      receiverId: req.params.id
    },
    orderBy: {
      followedDate: "desc"
    },
    include: {
      sender: {
        omit: {
          password: true
        }
      }
    }
  });
  res.status(200).json(inboxList);
});

export default signup;

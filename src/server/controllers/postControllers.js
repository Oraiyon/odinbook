import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
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

const post_post = [
  upload.single("file"),
  expressAsyncHandler(async (req, res, next) => {
    const post = await prisma.post.create({
      data: {
        authorId: req.body.author,
        text: req.body.text
      }
    });
    const imageURL = await cloudinary.uploader.upload(req.file.path, {
      folder: "odinbook_posts",
      public_id: post.id
    });
    await unlink(req.file.path);
    const finalPost = await prisma.post.update({
      where: {
        id: post.id
      },
      data: {
        image: imageURL.secure_url
      }
    });
    res.status(200).json(finalPost);
  })
];

export const get_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      _count: {
        select: {
          Comments: true
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const get_post = expressAsyncHandler(async (req, res, next) => {
  const post = await prisma.post.findFirst({
    where: {
      id: req.params.postId
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      _count: {
        select: {
          Comments: true
        }
      },
      author: true
    }
  });
  res.status(200).json(post);
});

export const get_user_posts = expressAsyncHandler(async (req, res, next) => {
  const postList = await prisma.post.findMany({
    where: {
      authorId: req.params.id
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      _count: {
        select: {
          Comments: true
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const get_following_posts = expressAsyncHandler(async (req, res, next) => {
  const followList = await prisma.follow.findMany({
    where: {
      senderId: req.params.id
    }
  });
  const followIds = [];
  for (const follow of followList) {
    followIds.push(follow.receiverId);
  }
  const postList = await prisma.post.findMany({
    where: {
      authorId: {
        in: followIds
      }
    },
    orderBy: {
      postDate: "desc"
    },
    include: {
      Likes: {
        include: {
          likedBy: true
        }
      },
      _count: {
        select: {
          Comments: true
        }
      },
      author: true
    }
  });
  res.status(200).json(postList);
});

export const delete_post = expressAsyncHandler(async (req, res, next) => {
  const [deletedLikes, deletedComments, deletePost] = await prisma.$transaction([
    prisma.likes.deleteMany({
      where: {
        postId: req.params.postId
      }
    }),
    prisma.comment.deleteMany({
      where: {
        postId: req.params.postId
      }
    }),
    prisma.post.delete({
      where: {
        id: req.params.postId,
        authorId: req.params.id
      }
    })
  ]);
  await cloudinary.uploader.destroy(`odinbook_posts/${req.params.postId}`);
  const path = req.path.split("/");
  let postList;
  if (path[path.length - 1] === "user") {
    postList = await prisma.post.findMany({
      where: {
        authorId: req.params.id
      },
      orderBy: {
        postDate: "desc"
      },
      include: {
        Likes: {
          include: {
            likedBy: true
          }
        },
        _count: {
          select: {
            Comments: true
          }
        },
        author: true
      }
    });
  } else {
    postList = await prisma.post.findMany({
      orderBy: {
        postDate: "desc"
      },
      include: {
        Likes: {
          include: {
            likedBy: true
          }
        },
        _count: {
          select: {
            Comments: true
          }
        },
        author: true
      }
    });
  }
  res.status(200).json(postList);
});

export const put_update_post = expressAsyncHandler(async (req, res, next) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: req.body.id
    },
    data: {
      text: req.body.text
    }
  });
  res.status(200).json(updatedPost);
});

export default post_post;

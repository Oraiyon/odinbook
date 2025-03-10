import { PrismaClient } from "@prisma/client";
import { get_following_posts, get_posts } from "./postControllers.js";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_like_post = [
  expressAsyncHandler(async (req, res, next) => {
    const alreadyLiked = await prisma.likes.findFirst({
      where: {
        likedById: req.body.id,
        postId: req.body.post
      }
    });
    if (!alreadyLiked) {
      await prisma.likes.create({
        data: {
          likedById: req.body.id,
          postId: req.body.post
        }
      });
    } else {
      await prisma.likes.delete({
        where: {
          id: alreadyLiked.id
        }
      });
    }
    if (req.body.page === "search") {
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
      return;
    } else if (req.body.page === "user" || req.body.page === "profile") {
      const postList = await prisma.post.findMany({
        where: {
          authorId: req.body.authorId
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
      return;
    }
    next();
  }),
  // For /feed
  get_following_posts
];

export default post_like_post;

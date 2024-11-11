import { PrismaClient } from "@prisma/client";
import { get_following_posts } from "./postControllers.js";
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
    next();
  }),
  get_following_posts
];

export default post_like_post;

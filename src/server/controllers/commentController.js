import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_comment = expressAsyncHandler(async (req, res, next) => {
  await prisma.comment.create({
    data: {
      authorId: req.body.author,
      text: req.body.text,
      postId: req.body.post
    }
  });
  const commentList = await prisma.comment.findMany({
    where: {
      postId: req.body.post
    },
    include: {
      Reply: {
        orderBy: {
          replyDate: "desc"
        }
      },
      author: true
    },
    orderBy: {
      commentDate: "asc"
    }
  });
  // Just jump to this with react
  res.status(200).json(commentList);
});

export const get_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    where: {
      postId: req.body.post
    },
    include: {
      Reply: {
        orderBy: {
          replyDate: "desc"
        }
      },
      author: true,
      post: true
    },
    orderBy: {
      commentDate: "asc"
    }
  });
  res.status(200).json(commentList);
});

export default post_comment;

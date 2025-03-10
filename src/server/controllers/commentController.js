import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_comment = expressAsyncHandler(async (req, res, next) => {
  const comment = await prisma.comment.create({
    data: {
      authorId: req.body.author,
      text: req.body.text,
      postId: req.body.post
    }
  });
  if (comment) {
    const commentList = await prisma.comment.findMany({
      where: {
        postId: req.body.post
      },
      include: {
        author: true
      },
      orderBy: {
        commentDate: "asc"
      }
    });
    // Just jump to this with react
    res.status(200).json(commentList);
  } else {
    res.status(200).json(false);
  }
});

export const get_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    where: {
      postId: req.params.postId
    },
    include: {
      author: true,
      post: true
    },
    orderBy: {
      commentDate: "asc"
    }
  });
  res.status(200).json(commentList);
});

export const delete_comment = expressAsyncHandler(async (req, res, next) => {
  const deletedComment = await prisma.comment.findFirst({
    where: {
      id: req.params.commentId,
      authorId: req.params.authorId
    }
  });
  if (deletedComment && deletedComment.text !== "---Comment Deleted---") {
    await prisma.comment.update({
      where: {
        id: req.params.commentId,
        authorId: req.params.authorId
      },
      data: {
        text: "---Comment Deleted---",
        deletedText: deletedComment.text
      }
    });
    const commentList = await prisma.comment.findMany({
      where: {
        postId: req.params.postId
      },
      include: {
        author: true,
        post: true
      },
      orderBy: {
        commentDate: "asc"
      }
    });
    res.status(200).json(commentList);
    return;
  } else {
    res.status(200).json(false);
    return;
  }
});

export default post_comment;

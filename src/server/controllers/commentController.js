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
        author: {
          omit: {
            password: true
          }
        }
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
      author: {
        omit: {
          password: true
        }
      },
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

export const delete_comment_admin = expressAsyncHandler(async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id
    }
  });
  if (user.admin) {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: req.params.commentId
      }
    });
    if (deletedComment) {
      const commentList = await prisma.comment.findMany({
        where: {
          authorId: deletedComment.authorId
        }
      });
      res.status(200).json(commentList);
      return;
    } else {
      res.status(200).json(false);
      return;
    }
  } else {
    res.status(200).json(false);
  }
});

export const get_search_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    where: {
      authorId: req.params.id,
      text: {
        contains: req.params.text
      }
    }
  });
  res.status(200).json(commentList);
});

export const get_all_user_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    where: {
      authorId: req.params.id
    }
  });
  res.status(200).json(commentList);
});

export const get_all_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    include: {
      author: {
        omit: {
          password: true
        }
      }
    }
  });
  res.status(200).json(commentList);
});

export const get_search_all_comments = expressAsyncHandler(async (req, res, next) => {
  const commentList = await prisma.comment.findMany({
    where: {
      text: req.params.text
    },
    include: {
      author: {
        omit: {
          password: true
        }
      }
    }
  });
  res.status(200).json(commentList);
});

export default post_comment;

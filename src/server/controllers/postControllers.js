import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_post = expressAsyncHandler(async (req, res, next) => {
  await prisma.post.create({
    data: {
      authorId: req.body.author,
      text: req.body.text
    }
  });
  const postList = await prisma.post.findMany({
    where: {
      authorId: req.body.author
    },
    orderBy: {
      postDate: "desc"
    }
  });
  res.status(200).json(postList);
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
      Likes: true,
      Comments: true
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
      Likes: true,
      Comments: {
        include: {
          Reply: true
        }
      }
    }
  });
  res.status(200).json(postList);
});

export const delete_post = expressAsyncHandler(async (req, res, next) => {
  await prisma.post.delete({
    where: {
      id: req.params.postId,
      authorId: req.params.id
    }
  });
  // Delete likes & comments too
  const postList = await prisma.post.findMany({
    where: {
      authorId: req.params.id
    },
    orderBy: {
      postDate: "desc"
    }
  });
  res.status(200).json(postList);
});

export default post_post;

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
  await prisma.likes.deleteMany({
    where: {
      postId: req.params.postId
    }
  });
  await prisma.reply.deleteMany({
    where: {
      postId: req.params.postId
    }
  });
  await prisma.comment.deleteMany({
    where: {
      postId: req.params.postId
    }
  });
  await prisma.post.delete({
    where: {
      id: req.params.postId,
      authorId: req.params.id
    }
  });
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

export default post_post;

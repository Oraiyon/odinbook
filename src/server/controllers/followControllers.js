import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const get_follow = expressAsyncHandler(async (req, res, next) => {
  const following = await prisma.follow.findFirst({
    where: {
      senderId: req.params.sender,
      receiverId: req.params.receiver
    }
  });
  res.status(200).json(following);
});

export const get_followers = expressAsyncHandler(async (req, res, next) => {
  const followersList = await prisma.follow.findMany({
    where: {
      receiverId: req.params.id
    },
    include: {
      sender: true
    }
  });
  res.status(200).json(followersList);
});

export const get_following = expressAsyncHandler(async (req, res, next) => {
  const followingList = await prisma.follow.findMany({
    where: {
      senderId: req.params.id
    },
    include: {
      receiver: true
    }
  });
  res.status(200).json(followingList);
});

const post_follow = expressAsyncHandler(async (req, res, next) => {
  const alreadyFollowing = await prisma.follow.findFirst({
    where: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
    }
  });
  if (alreadyFollowing) {
    res.status(200).json(false);
    return;
  }
  await prisma.follow.create({
    data: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
    }
  });
  const user = await prisma.user.findFirst({
    where: {
      id: req.body.sender
    },
    include: {
      Followers: {
        include: {
          sender: true,
          receiver: true
        }
      },
      Following: {
        include: {
          sender: true,
          receiver: true
        }
      }
    }
  });
  res.status(200).json(user);
});

export const delete_follow = expressAsyncHandler(async (req, res, next) => {
  const alreadyFollowing = await prisma.follow.findFirst({
    where: {
      senderId: req.params.sender,
      receiverId: req.params.receiver
    }
  });
  if (alreadyFollowing) {
    await prisma.follow.delete({
      where: {
        id: alreadyFollowing.id
      }
    });
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.sender
      },
      include: {
        Followers: {
          include: {
            sender: true,
            receiver: true
          }
        },
        Following: {
          include: {
            sender: true,
            receiver: true
          }
        }
      }
    });
    res.status(200).json(user);
  } else {
    res.status(200).json(false);
  }
});

export default post_follow;

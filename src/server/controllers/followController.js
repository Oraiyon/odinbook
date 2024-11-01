import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_follow_user = expressAsyncHandler(async (req, res, next) => {
  const alreadyFollowing = await prisma.follow.findFirst({
    where: {
      OR: [
        {
          followedById: req.body.sender,
          followingId: req.body.receiver
        },
        {
          followedById: req.body.receiver,
          followingId: req.body.sender
        }
      ]
    }
  });
  const request = await prisma.request.findFirst({
    where: {
      OR: [
        {
          senderId: req.body.sender,
          receiverId: req.body.receiver
        },
        {
          senderId: req.body.receiver,
          receiverId: req.body.sender
        }
      ]
    }
  });
  if (alreadyFollowing || !request) {
    res.status(200).json(false);
    return;
  }
  await prisma.request.delete({
    where: {
      id: request.id
    }
  });
  await prisma.follow.create({
    data: {
      followedById: req.body.sender,
      followingId: req.body.receiver
    }
  });
  const requestList = await prisma.request.findMany({
    where: {
      OR: [
        {
          senderId: req.body.sender
        },
        {
          receiverId: req.body.sender
        }
      ]
    },
    include: {
      sender: true,
      receiver: true
    }
  });
  const followList = await prisma.follow.findMany({
    where: {
      OR: [
        {
          followedById: req.body.sender
        },
        {
          followingId: req.body.sender
        }
      ]
    },
    include: {
      followedBy: true,
      following: true
    }
  });
  res.status(200).json({ requestList: requestList, followList: followList });
});

export default post_follow_user;

import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const get_followers = expressAsyncHandler(async (req, res, next) => {
  const followersList = await prisma.follow.findMany({
    where: {
      receiverId: req.params.id
    }
  });
  res.status(200).json(followersList);
});

export const get_following = expressAsyncHandler(async (req, res, next) => {
  const followingList = await prisma.follow.findMany({
    where: {
      senderId: req.params.id
    }
  });
  res.status(200).json(followingList);
});

const post_accept_follow = expressAsyncHandler(async (req, res, next) => {
  const alreadyFollowing = await prisma.follow.findFirst({
    where: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
    }
  });
  const request = await prisma.request.findFirst({
    where: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
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
      senderId: req.body.sender,
      receiverId: req.body.receiver
    }
  });
  const requestList = await prisma.request.findMany({
    where: {
      senderId: req.body.sender
    },
    include: {
      receiver: true
    }
  });
  res.status(200).json(requestList);
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
    const followList = await prisma.follow.findMany({
      where: {
        senderId: req.params.sender
      }
    });
    res.status(200).json(followList);
  } else {
    res.status(200).json(false);
  }
});

export default post_accept_follow;

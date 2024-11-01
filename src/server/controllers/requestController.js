import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_request = expressAsyncHandler(async (req, res, next) => {
  const alreadyRequestedFollow = await prisma.request.findFirst({
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
  if (alreadyRequestedFollow) {
    res.status(200).json(false);
    return;
  }
  await prisma.request.create({
    data: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
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
  res.status(200).json(requestList);
});

export const delete_delete_request = expressAsyncHandler(async (req, res, next) => {
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
  if (!request) {
    res.status(200).json(false);
    return;
  }
  await prisma.request.delete({
    where: {
      id: request.id
    }
  });
  const requestList = await prisma.request.findMany({
    where: {
      senderId: req.body.sender
    }
  });
  res.status(200).json(requestList);
});

export default post_request;

import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const post_request_follow = expressAsyncHandler(async (req, res, next) => {
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

export default post_request_follow;

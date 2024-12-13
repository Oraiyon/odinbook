import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const get_sent_request = expressAsyncHandler(async (req, res, next) => {
  const request = await prisma.request.findFirst({
    where: {
      senderId: req.params.sender,
      receiverId: req.params.receiver
    }
  });
  res.status(200).json(request);
});

export const get_sent_requests = expressAsyncHandler(async (req, res, next) => {
  const requestList = await prisma.request.findMany({
    where: {
      senderId: req.params.id
    }
  });
  res.status(200).json(requestList);
});

export const get_received_requests = expressAsyncHandler(async (req, res, next) => {
  const requestList = await prisma.request.findMany({
    where: {
      receiverId: req.params.id
    }
  });
  res.status(200).json(requestList);
});

const post_request = expressAsyncHandler(async (req, res, next) => {
  const alreadyRequestedFollow = await prisma.request.findFirst({
    where: {
      senderId: req.body.sender,
      receiverId: req.body.receiver
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
      senderId: req.body.sender
    },
    include: {
      sender: true,
      receiver: true
    }
  });
  res.status(200).json(requestList);
});

export const delete_request = expressAsyncHandler(async (req, res, next) => {
  const request = await prisma.request.findFirst({
    where: {
      senderId: req.params.sender,
      receiverId: req.params.receiver
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
      senderId: req.params.sender
    }
  });
  res.status(200).json(requestList);
});

export default post_request;

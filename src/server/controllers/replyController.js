import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_reply = expressAsyncHandler(async (req, res, next) => {
  await prisma.reply.create({
    data: {
      authorId: req.body.author,
      text: req.body.text,
      replyToId: req.body.replyTo
    }
  });
  const commentList = await prisma.comment.findMany({
    where: {
      id: req.body.replyTo
    },
    include: {
      Reply: {
        orderBy: {
          replyDate: "desc"
        }
      }
    },
    orderBy: {
      commentDate: "desc"
    }
  });
  // Just jump to this reply with react
  res.status(200).json(commentList);
});

export default post_reply;

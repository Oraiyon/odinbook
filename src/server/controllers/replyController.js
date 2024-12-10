import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const post_reply = expressAsyncHandler(async (req, res, next) => {
  await prisma.reply.create({
    data: {
      authorId: req.body.authorId,
      text: req.body.text,
      replyToId: req.body.replyToId,
      postId: req.body.postId
    }
  });
  const commentList = await prisma.comment.findMany({
    where: {
      id: req.body.replyToId
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
  // Just jump to this with react
  res.status(200).json(commentList);
});

export default post_reply;

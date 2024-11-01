import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const post_follow_user = expressAsyncHandler(async (req, res, next) => {});

export default post_follow_user;

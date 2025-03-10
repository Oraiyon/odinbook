import request from "supertest";
import express from "express";
import { test } from "vitest";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "../../src/server/router.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", router);

const databaseURL =
  process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseURL
    }
  }
});

test("index route works", async () => {
  const response = await request(app)
    .post("/signup")
    .send({
      username: "test2",
      pasword: "test2password"
    })
    .set("Accept", "application/json")
    .expect("Content-type", /json/)
    .expect(200);
});

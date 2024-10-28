import testIndex from "../../src/server/controllers/testController.js";
import request from "supertest";
import express from "express";
import { test } from "vitest";
import dotenv from dotenv;
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", testIndex);

const databseURL = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databseURL
    }
  }
})

test("index route works", (done) => {
  request(app).get("/").expect("Content-Type", /json/).expect({ name: "frodo" }).expect(200, done);
});

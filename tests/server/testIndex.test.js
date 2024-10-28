import testIndex from "../../src/server/controllers/testController.js";
import request from "supertest";
import express from "express";
import { test } from "vitest";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", testIndex);

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
  const response = await request(app).get("/");
  // expect(response.headers["Content-Type"]).toMatch(/json/);
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual("frodo");
});

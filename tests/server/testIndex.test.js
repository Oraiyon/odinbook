import testIndex from "../../src/server/controllers/testController.js";
import request from "supertest";
import express from "express";
import { test } from "vitest";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", testIndex);

test("index route works", (done) => {
  request(app).get("/").expect("Content-Type", /json/).expect({ name: "frodo" }).expect(200, done);
});

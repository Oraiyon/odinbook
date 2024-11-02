import express from "express";
import signup, { login, logout } from "./controllers/userControllers.js";
import post_request, { delete_request } from "./controllers/requestControllers.js";
import post_follow, { delete_follow } from "./controllers/followControllers.js";

const router = express.Router();

// userControllers
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// requestControllers
router.post("/api/requestFollow", post_request);
router.delete("/api/deleteRequest", delete_request);

// followControllers
router.post("/api/followuser", post_follow);
router.delete("/api/deleteFollow", delete_follow);

// postControllers

export default router;

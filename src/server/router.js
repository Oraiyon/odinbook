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
router.post("/api/request/follow", post_request);
router.delete("/api/request/delete", delete_request);

// followControllers
router.post("/api/follow/user", post_follow);
router.delete("/api/follow/delete", delete_follow);

// postControllers

export default router;

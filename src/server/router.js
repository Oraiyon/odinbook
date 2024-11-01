import express from "express";
import signup, { login, logout } from "./controllers/userControllers.js";
import post_request, { delete_delete_request } from "./controllers/requestController.js";
import post_follow_user from "./controllers/followController.js";

const router = express.Router();

// userController
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// requestController
router.post("/api/requestFollow", post_request);
router.delete("/api/deleteRequest", delete_delete_request);

// followController
router.post("/api/followuser", post_follow_user);

export default router;

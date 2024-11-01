import express from "express";
import signup, { login, logout } from "./controllers/userControllers.js";
import post_follow_user from "./controllers/followController.js";
import post_request_follow, { get_requests } from "./controllers/requestController.js";

const router = express.Router();

// userController
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// requestController
router.post("/api/requestFollow", post_request_follow);
router.get("/api/getRequests/:id", get_requests);

// followController
// router.post("/api/followuser", post_follow_user);

export default router;

import express from "express";
import signup, { login, logout } from "./controllers/userControllers.js";
import post_request, { delete_request } from "./controllers/requestController.js";
import post_follow from "./controllers/followController.js";

const router = express.Router();

// userController
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// requestController
router.post("/api/requestFollow", post_request);
router.delete("/api/deleteRequest", delete_request);

// followController
router.post("/api/followuser", post_follow);

export default router;

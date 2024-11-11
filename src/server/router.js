import express from "express";
import signup, { login, logout } from "./controllers/userControllers.js";
import post_request, {
  delete_request,
  get_received_requests,
  get_sent_requests
} from "./controllers/requestControllers.js";
import post_accept_follow, {
  delete_follow,
  get_followers,
  get_following
} from "./controllers/followControllers.js";
import post_post, {
  get_user_posts,
  get_following_posts,
  delete_post
} from "./controllers/postControllers.js";
import post_like_post from "./controllers/likeControllers.js";
import post_comment from "./controllers/commentController.js";
import post_reply from "./controllers/replyController.js";

const router = express.Router();

// "0a97755c-23c2-495f-8d7f-017f4ee1115b" Comment "5945af2b-7fab-46cb-b75b-70f7e5a21452"
// "e9a6adf1-b54d-473c-91d7-fe8332b6d8e9" Follows

// userControllers
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// requestControllers
router.get("/api/:id/sent/requests", get_sent_requests);
router.get("/api/:id/received/requests", get_received_requests);
router.post("/api/create/request", post_request);
router.delete("/api/delete/request/:sender/:receiver", delete_request);

// followControllers
router.get("/api/:id/followers", get_followers);
router.get("/api/:id/following", get_following);
router.post("/api/accept/follow", post_accept_follow);
router.delete("/api/delete/follow/:sender/:receiver", delete_follow);

// postControllers
router.post("/api/create/post", post_post);
router.get("/api/:id/get/posts", get_user_posts);
router.get("/api/:id/get/following/posts", get_following_posts);
router.delete("/api/:id/delete/:postId", delete_post);

// likeControllers
router.post("/api/like/post", post_like_post);

// commentControllers
router.post("/api/post/create/comment", post_comment);

// replyControllers
router.post("/api/post/create/reply", post_reply);

export default router;

import express from "express";
import signup, {
  get_search_user,
  get_user_profile,
  login,
  logout
} from "./controllers/userControllers.js";
import post_request, {
  delete_request,
  get_received_requests,
  get_sent_request,
  get_sent_requests
} from "./controllers/requestControllers.js";
import post_follow, {
  delete_follow,
  get_follow,
  get_followers,
  get_following
} from "./controllers/followControllers.js";
import post_post, {
  get_user_posts,
  get_following_posts,
  delete_post,
  get_posts,
  get_post
} from "./controllers/postControllers.js";
import post_like_post from "./controllers/likeControllers.js";
import post_comment, { get_comments } from "./controllers/commentController.js";
import post_reply from "./controllers/replyController.js";

const router = express.Router();

// userControllers
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/api/search/:username", get_search_user);
router.get("/api/:id/profile", get_user_profile);

// requestControllers
// router.get("/api/:sender/requests/:receiver", get_sent_request);
// router.get("/api/:id/sent/requests", get_sent_requests);
// router.get("/api/:id/received/requests", get_received_requests);
// router.post("/api/create/request", post_request);
// router.delete("/api/delete/request/:sender/:receiver", delete_request);

// followControllers
router.get("/api/:sender/following/:receiver", get_follow);
router.get("/api/:id/followers", get_followers);
router.get("/api/:id/following", get_following);
router.post("/api/send/follow", post_follow);
router.delete("/api/delete/follow/:sender/:receiver", delete_follow);

// postControllers
router.post("/api/create/post", post_post);
router.get("/api/get/posts", get_posts);
router.get("/api/get/:postId", get_post);
router.get("/api/:id/get/posts", get_user_posts);
router.get("/api/:id/get/following/posts", get_following_posts);
router.delete("/api/:id/delete/:postId", delete_post);

// likeControllers
router.post("/api/:id/like/post", post_like_post);

// commentControllers
router.post("/api/post/create/comment", post_comment);
router.get("/api/get/:postId/comments", get_comments);

// replyControllers
router.post("/api/post/create/reply", post_reply);

export default router;

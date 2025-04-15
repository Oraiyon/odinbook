import express from "express";
import signup, {
  delete_user,
  admin_get_users,
  get_search_user,
  get_user_profile,
  login,
  logout,
  put_user_default_picture,
  put_user_profile_picture,
  put_user_profile_username
} from "./controllers/userControllers.js";
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
  get_post,
  put_update_post,
  get_search_post,
  get_search_post_text
} from "./controllers/postControllers.js";
import post_like_post from "./controllers/likeControllers.js";
import post_comment, {
  delete_comment,
  delete_comment_admin,
  get_all_user_comments,
  get_comments,
  get_search_comments
} from "./controllers/commentController.js";

const router = express.Router();

// userControllers
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/api/search/:username", get_search_user);
router.get("/api/:id/profile", get_user_profile);
router.put("/api/user/edit/username", put_user_profile_username);
router.put("/api/user/edit/picture", put_user_profile_picture);
router.put("/api/user/edit/default", put_user_default_picture);
router.delete("/api/user/delete/:id", delete_user);
router.delete("/api/admin/delete/:id", delete_user);
router.get("/api/admin/search/users", admin_get_users);

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
router.delete("/api/:id/delete/:postId/user", delete_post);
router.put("/api/update/post/:postId", put_update_post);
router.get("/api/admin/search/:id/:postText", get_search_post);
router.get("/api/admin/search/post/:text/text", get_search_post_text);

// likeControllers
router.post("/api/:id/like/post", post_like_post);

// commentControllers
router.post("/api/post/create/comment", post_comment);
router.get("/api/get/:postId/comments", get_comments);
router.delete("/api/:authorId/delete/:postId/:commentId", delete_comment);
router.delete("/api/admin/:id/delete/comment/:commentId", delete_comment_admin);
router.get("/api/admin/search/:id/:text/comment", get_search_comments);
router.get("/api/admin/search/:id/comment/user", get_all_user_comments);

export default router;

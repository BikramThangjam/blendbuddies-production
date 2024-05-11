import express from "express";
import {getComments, getFeedPosts, getUserPosts, likePost, addComment, deletePost, searchPost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);
router.get("/:postId/comments", verifyToken, getComments);
router.post("/addComment", verifyToken, addComment);
router.delete("/:id", verifyToken, deletePost);
router.get("/search", verifyToken, searchPost)

export default router;
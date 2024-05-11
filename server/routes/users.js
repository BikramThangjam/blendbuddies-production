import express from "express";
import {getAllUsers, getUser,searchUser, getUserFriends,getFriendSuggestions, addRemoveFriend, updateSocial, updateProfile} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/search", verifyToken, searchUser);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/suggestions", verifyToken, getFriendSuggestions);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id", verifyToken, updateSocial);



export default router;
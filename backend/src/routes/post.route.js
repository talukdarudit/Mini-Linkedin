import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getMyPosts,
  getAllPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost", protectRoute, createPost);

router.get("/getmyposts", protectRoute, getMyPosts);

router.get("/getallposts", protectRoute, getAllPosts);

export default router;

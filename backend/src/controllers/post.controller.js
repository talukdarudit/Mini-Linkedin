import Post from "../models/post.model.js";
import { ObjectId } from "mongodb";

export const createPost = async (req, res) => {
  try {
    const { postContent } = req.body;
    const userId = req.user._id;
    const authorName = req.user.fullName;

    const newPost = new Post({
      userId,
      authorName,
      postContent,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const myId = req.user._id;

    const posts = await Post.find({ userId: myId });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getMyPosts controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

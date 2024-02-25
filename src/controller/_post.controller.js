// Import necessary modules
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import Post from "../model/Post.js";

const unlinkAsync = promisify(fs.unlink);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../post_upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Function to create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const post = await Post.create({ title, content, image });
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a post by id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a post by id
export const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.image) {
      await unlinkAsync(path.join("uploads/", post.image));
    }
    await post.destroy();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a post by id
export const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    if (post.image && image) {
      await unlinkAsync(path.join("uploads/", post.image));
    }
    post.title = title;
    post.content = content;
    post.image = image || post.image;
    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

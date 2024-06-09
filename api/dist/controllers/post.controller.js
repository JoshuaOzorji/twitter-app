"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserPosts = exports.getFollowingPosts = exports.getLikedPosts = exports.getAllPosts = exports.likeUnlikePost = exports.commentOnPost = exports.deletePost = exports.createPost = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_1 = require("cloudinary");
const post_model_1 = __importDefault(require("../models/post.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }
        if (img) {
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new post_model_1.default({
            user: userId,
            text,
            img,
        });
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "createPost");
    }
};
exports.createPost = createPost;
const deletePost = async (req, res) => {
    try {
        const post = await post_model_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ error: "You are not authorized to delete this post" });
        }
        const imgId = post.img && post.img.split("/").pop()?.split(".")[0];
        if (imgId) {
            await cloudinary_1.v2.uploader.destroy(imgId);
        }
        else {
            console.log("Image ID not found");
        }
        await post_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "deletePost");
    }
};
exports.deletePost = deletePost;
const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "likeUnlikePost");
    }
};
exports.commentOnPost = commentOnPost;
const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            //Unlike post
            await post_model_1.default.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await user_model_1.default.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        }
        else {
            // Like post
            post.likes.push(userId);
            await user_model_1.default.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();
            const notification = new notification_model_1.default({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "likeUnlikePost");
    }
};
exports.likeUnlikePost = likeUnlikePost;
const getAllPosts = async (req, res) => {
    try {
        const posts = await post_model_1.default.find()
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getAllPosts");
    }
};
exports.getAllPosts = getAllPosts;
const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const likedPosts = await post_model_1.default.find({
            _id: { $in: user.likedPosts },
        })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });
        res.status(200).json(likedPosts);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getLikedPosts");
    }
};
exports.getLikedPosts = getLikedPosts;
const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const following = user.following;
        const feedPosts = await post_model_1.default.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });
        res.status(200).json(feedPosts);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getFollowingPosts");
    }
};
exports.getFollowingPosts = getFollowingPosts;
const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await user_model_1.default.findOne({ username });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const posts = await post_model_1.default.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" })
            .populate({ path: "comments.user", select: "-password" });
        res.status(200).json(posts);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getUserPosts");
    }
};
exports.getUserPosts = getUserPosts;
const getUserById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await post_model_1.default.findById(postId)
            .populate("user", "username fullName profileImg")
            .populate("comments.user", "username fullName profileImg")
            .exec();
        if (!post) {
            res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "updateUser");
    }
};
exports.getUserById = getUserById;

import { Request, Response } from "express";
import handleServerError from "../utils/errorHandler";
import User from "../models/user.model";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model";

export const createPost = async (req: Request, res: Response) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error: any) {
		handleServerError(res, error, "createPost");
	}
};

export const deletePost = async (req: Request, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res
				.status(401)
				.json({ error: "You are not authorized to delete this post" });
		}

		//   if (post.img) {
		//     const imgId = post.img.split("/").pop()?.split(".")[0];
		//     if (imgId) {
		//         await cloudinary.uploader.destroy(imgId);
		//     } else {
		//         console.error("Image ID not found");
		//     }
		// }

		const imgId = post.img && post.img.split("/").pop()?.split(".")[0];
		if (imgId) {
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error: any) {
		handleServerError(res, error, "deletePost");
	}
};

export const commentOnPost = async (req: Request, res: Response) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error: any) {
		handleServerError(res, error, "likeUnlikePost");
	}
};

export const likeUnlikePost = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);
		if (userLikedPost) {
			//Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
		}
	} catch (error: any) {
		handleServerError(res, error, "likeUnlikePost");
	}
};

export const getAllPosts = async (req: Request, res: Response) => {};

export const getFollowingPosts = async (req: Request, res: Response) => {};

export const getLikedPosts = async (req: Request, res: Response) => {};

export const getUserPosts = async (req: Request, res: Response) => {};

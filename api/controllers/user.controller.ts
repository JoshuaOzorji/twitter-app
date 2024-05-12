import { Request, Response } from "express";
import User from "../models/user.model";

export const getUserProfile = async (req: Request, res: Response) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");

		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile:", (error as Error).message);
		res.status(500).json({ error: (error as Error).message });
	}
};

export const followUnfollowUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res
				.status(400)
				.json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// const isFollowing = currentUser.following.includes(id);
		const isFollowing = currentUser.following
			.map((f) => f.toString())
			.includes(id);

		if (isFollowing) {
			//Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser:", (error as Error).message);
		res.status(500).json({ error: (error as Error).message });
	}
};

export const getSuggestedUsers = async (req: Request, res: Response) => {};

export const updateUser = async (req: Request, res: Response) => {};

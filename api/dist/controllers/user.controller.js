"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getSuggestedUsers = exports.followUnfollowUser = exports.getUserProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await user_model_1.default.findOne({ username }).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getUserProfile");
    }
};
exports.getUserProfile = getUserProfile;
const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await user_model_1.default.findById(id);
        const currentUser = await user_model_1.default.findById(req.user._id);
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
            await user_model_1.default.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await user_model_1.default.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed" });
        }
        else {
            //Follow the user
            await user_model_1.default.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await user_model_1.default.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Send notification to the user
            const newNotification = new notification_model_1.default({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "followUnfollowUser");
    }
};
exports.followUnfollowUser = followUnfollowUser;
const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await user_model_1.default.findById(userId).select("following");
        const users = await user_model_1.default.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            { $sample: { size: 10 } },
        ]);
        //1,2,3,4,5,6
        const filteredUsers = users.filter((user) => !usersFollowedByMe?.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getSuggestedUsers");
    }
};
exports.getSuggestedUsers = getSuggestedUsers;
const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    try {
        let user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Check if the updated username already exists
        if (username !== user.username) {
            const existingUser = await user_model_1.default.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists" });
            }
        }
        if ((!newPassword && currentPassword) ||
            (!currentPassword && newPassword)) {
            return res.status(400).json({
                error: "Please provide both current password and new password",
            });
        }
        if (currentPassword && newPassword) {
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch)
                return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ error: "Password must be at least 6 characters long" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(newPassword, salt);
        }
        if (profileImg) {
            if (user.profileImg) {
                await cloudinary_1.v2.uploader.destroy(user.profileImg.split("/").pop()?.split(".")[0] || "");
            }
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary_1.v2.uploader.destroy(user.coverImg.split("/").pop()?.split(".")[0] || "");
            }
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        user.fullName = fullName ?? user.fullName;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.bio = bio ?? user.bio;
        user.link = link ?? user.link;
        user.profileImg = profileImg ?? user.profileImg;
        user.coverImg = coverImg ?? user.coverImg;
        user = await user.save();
        // Ensure user.password is a string or null
        user.password = null;
        return res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "updateUser");
    }
};
exports.updateUser = updateUser;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield user_model_1.default.findOne({ username }).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getUserProfile");
    }
});
exports.getUserProfile = getUserProfile;
const followUnfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userToModify = yield user_model_1.default.findById(id);
        const currentUser = yield user_model_1.default.findById(req.user._id);
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
            yield user_model_1.default.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            yield user_model_1.default.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed" });
        }
        else {
            //Follow the user
            yield user_model_1.default.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            yield user_model_1.default.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Send notification to the user
            const newNotification = new notification_model_1.default({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            yield newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "followUnfollowUser");
    }
});
exports.followUnfollowUser = followUnfollowUser;
const getSuggestedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = yield user_model_1.default.findById(userId).select("following");
        const users = yield user_model_1.default.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            { $sample: { size: 10 } },
        ]);
        //1,2,3,4,5,6
        const filteredUsers = users.filter((user) => !(usersFollowedByMe === null || usersFollowedByMe === void 0 ? void 0 : usersFollowedByMe.following.includes(user._id)));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getSuggestedUsers");
    }
});
exports.getSuggestedUsers = getSuggestedUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    try {
        let user = yield user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Check if the updated username already exists
        if (username !== user.username) {
            const existingUser = yield user_model_1.default.findOne({ username });
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
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch)
                return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ error: "Password must be at least 6 characters long" });
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.password = yield bcryptjs_1.default.hash(newPassword, salt);
        }
        if (profileImg) {
            if (user.profileImg) {
                yield cloudinary_1.v2.uploader.destroy(((_a = user.profileImg.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) || "");
            }
            const uploadedResponse = yield cloudinary_1.v2.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                yield cloudinary_1.v2.uploader.destroy(((_b = user.coverImg.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0]) || "");
            }
            const uploadedResponse = yield cloudinary_1.v2.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        user.fullName = fullName !== null && fullName !== void 0 ? fullName : user.fullName;
        user.email = email !== null && email !== void 0 ? email : user.email;
        user.username = username !== null && username !== void 0 ? username : user.username;
        user.bio = bio !== null && bio !== void 0 ? bio : user.bio;
        user.link = link !== null && link !== void 0 ? link : user.link;
        user.profileImg = profileImg !== null && profileImg !== void 0 ? profileImg : user.profileImg;
        user.coverImg = coverImg !== null && coverImg !== void 0 ? coverImg : user.coverImg;
        user = yield user.save();
        // Ensure user.password is a string or null
        user.password = null;
        return res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "updateUser");
    }
});
exports.updateUser = updateUser;

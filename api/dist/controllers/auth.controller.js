"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingUser = await user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        const existingEmail = await user_model_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            fullName,
            username,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            (0, generateToken_1.generateTokenAndSetCookie)(newUser._id.toString(), res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "signup");
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_model_1.default.findOne({ username });
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        (0, generateToken_1.generateTokenAndSetCookie)(user._id.toString(), res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "login");
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "logout");
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getMe");
    }
};
exports.getMe = getMe;

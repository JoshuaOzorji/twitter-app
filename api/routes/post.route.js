"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.default.Router();
router.post("/create", protectRoute_1.protectRoute, post_controller_1.createPost);
router.delete("/:id", protectRoute_1.protectRoute, post_controller_1.deletePost);
router.post("/comment/:id", protectRoute_1.protectRoute, post_controller_1.commentOnPost);
router.post("/like/:id", protectRoute_1.protectRoute, post_controller_1.likeUnlikePost);
router.get("/all", protectRoute_1.protectRoute, post_controller_1.getAllPosts);
router.get("/likes/:id", protectRoute_1.protectRoute, post_controller_1.getLikedPosts);
router.get("/following", protectRoute_1.protectRoute, post_controller_1.getFollowingPosts);
router.get("/user/:username", protectRoute_1.protectRoute, post_controller_1.getUserPosts);
router.get("/user/:id", protectRoute_1.protectRoute, post_controller_1.getUserById);
exports.default = router;

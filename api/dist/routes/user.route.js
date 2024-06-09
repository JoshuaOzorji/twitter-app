"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/profile/:username", protectRoute_1.protectRoute, user_controller_1.getUserProfile);
router.post("/follow/:id", protectRoute_1.protectRoute, user_controller_1.followUnfollowUser);
router.get("/suggested", protectRoute_1.protectRoute, user_controller_1.getSuggestedUsers);
router.post("/update", protectRoute_1.protectRoute, user_controller_1.updateUser);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotifications = exports.notificationsRead = exports.getNotifications = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notification_model_1.default.find({
            to: userId,
        }).populate({ path: "from", select: "username profileImg" });
        const notificationCount = notifications.filter((notification) => !notification.read).length;
        res.status(200).json({ notifications, notificationCount });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getNotifications");
    }
};
exports.getNotifications = getNotifications;
// Mark notifications as read
const notificationsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await notification_model_1.default.updateMany({ to: userId }, { read: true });
        res.status(200).json({ message: "Notifications marked as read" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "notificationsRead");
    }
};
exports.notificationsRead = notificationsRead;
const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await notification_model_1.default.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "deleteNotifications");
    }
};
exports.deleteNotifications = deleteNotifications;

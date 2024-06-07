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
exports.deleteNotifications = exports.notificationsRead = exports.getNotifications = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const notifications = yield notification_model_1.default.find({
            to: userId,
        }).populate({ path: "from", select: "username profileImg" });
        const notificationCount = notifications.filter((notification) => !notification.read).length;
        res.status(200).json({ notifications, notificationCount });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "getNotifications");
    }
});
exports.getNotifications = getNotifications;
// Mark notifications as read
const notificationsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        yield notification_model_1.default.updateMany({ to: userId }, { read: true });
        res.status(200).json({ message: "Notifications marked as read" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "notificationsRead");
    }
});
exports.notificationsRead = notificationsRead;
const deleteNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        yield notification_model_1.default.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.default)(res, error, "deleteNotifications");
    }
});
exports.deleteNotifications = deleteNotifications;

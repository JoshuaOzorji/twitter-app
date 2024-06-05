import { Request, Response } from "express";
import handleServerError from "../utils/errorHandler";
import Notification from "../models/notification.model";

export const getNotifications = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({
			to: userId,
		}).populate({ path: "from", select: "username profileImg" });

		const notificationCount = notifications.filter(
			(notification) => !notification.read,
		).length;

		res.status(200).json({ notifications, notificationCount });
	} catch (error: any) {
		handleServerError(res, error, "getNotifications");
	}
};

// Mark notifications as read
export const notificationsRead = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		await Notification.updateMany({ to: userId }, { read: true });
		res.status(200).json({ message: "Notifications marked as read" });
	} catch (error: any) {
		handleServerError(res, error, "notificationsRead");
	}
};

export const deleteNotifications = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error: any) {
		handleServerError(res, error, "deleteNotifications");
	}
};

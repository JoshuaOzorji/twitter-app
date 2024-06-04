import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
	deleteNotifications,
	getNotifications,
	notificationsRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.post("/", protectRoute, notificationsRead);
export default router;

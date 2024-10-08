import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import postRoutes from "./routes/post.route";
import notificationsRoutes from "./routes/notification.route";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import job from "./cron.js";
import connectMongoDB from "./db/connectMongoDB";

dotenv.config();
job.start();
const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "https://twitter-appp.vercel.app",
		credentials: true,
	}),
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running`);
	connectMongoDB();
});

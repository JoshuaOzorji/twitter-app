import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User from "../models/user.model";

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

export const protectRoute = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No token provided" });
		}

		if (!process.env.JWT_SECRET) {
			return res.status(500).json({ error: "JWT secret not found" });
		}

		// JWT_SECRET is defined, so it's safe to use
		const jwtSecret: Secret = process.env.JWT_SECRET;

		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized invalid token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protectRoute middleware", (error as Error).message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

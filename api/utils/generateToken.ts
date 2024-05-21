import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		// sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		sameSite: "none", // Needed for cross-site requests
		// secure: process.env.NODE_ENV !== "development",
		secure: true,
	});
};

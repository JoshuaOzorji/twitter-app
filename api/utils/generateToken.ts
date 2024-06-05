import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //MS
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});
};

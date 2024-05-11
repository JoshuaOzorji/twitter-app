import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const protectRoute = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.jwt;
	} catch (error) {}
};

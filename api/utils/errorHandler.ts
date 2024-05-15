import { Response } from "express";

const handleServerError = (
	res: Response,
	error: Error,
	functionName: string,
) => {
	console.error(`Error in ${functionName} controller:`, error.message);
	res.status(500).json({ error: error.message });
};

export default handleServerError;

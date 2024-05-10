import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		const uri = process.env.MONGODB_URI || "default_mongodb_uri";
		const conn = await mongoose.connect(uri);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
		process.exit(1);
	}
};

export default connectMongoDB;

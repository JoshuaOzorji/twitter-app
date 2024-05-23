import { Document, Types } from "mongoose";

type Comment = {
	text: string;
	user: Types.ObjectId;
};

export type PostType = Document & {
	user: Types.ObjectId | UserType;
	text?: string;
	img?: string;
	likes: Types.ObjectId[];
	comments: Comment[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type Post = {
	post: {
		_id: string;
		user: User; // Ensure post.user is of type User
		text: string;
		img?: string;
		likes: string[]; // Assuming likes are represented by user IDs
		comments: {
			_id: string;
			text: string;
			user: User; // Ensure comment.user is of type User
		}[];
		createdAt: Date;
		updatedAt: Date;
	};
};

export type User = Document & {
	username: string;
	fullName: string;
	password: string;
	email: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	profileImg?: string;
	coverImg?: string;
	bio?: string;
	link?: string;
	likedPosts: Types.ObjectId[];
	createdAt?: Date;
	updatedAt?: Date;
};

export type UserType = {
	_id: Types.ObjectId;
	username: string;
	fullName: string;
	profileImg?: string;
};

export type CommentType = {
	_id: Types.ObjectId;
	user: UserType;
	text: string;
	createdAt?: Date;
	updatedAt?: Date;
};

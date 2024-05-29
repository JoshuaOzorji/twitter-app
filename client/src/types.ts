import { Document, Types } from "mongoose";
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

export type PostType = Document & {
	user: UserType;
	text?: string;
	img?: string;
	likes: Types.ObjectId[];
	comments: CommentType[];
	createdAt?: Date;
	updatedAt?: Date;
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

export type Notification = {
	_id: string;
	from: User;
	to: User;
	type: "follow" | "like";
	read: boolean;
	createdAt: string;
	updatedAt: string;
};

export type FormData = {
	fullName: string;
	username: string;
	email: string;
	bio: string;
	link: string;
	newPassword: string;
	currentPassword: string;
	profileImg?: string | null;
	coverImg?: string | null;
};

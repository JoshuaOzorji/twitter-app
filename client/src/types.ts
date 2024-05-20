export interface User {
	username: string;
	profileImg: string;
	fullName: string;
}

export interface Comment {
	_id: string;
	text: string;
	user: User;
}

export interface PostType {
	_id: string;
	text: string;
	img?: string;
	user: {
		username: string;
		profileImg: string;
		fullName: string;
	};
	comments: {
		_id: string;
		text: string;
		user: {
			username: string;
			profileImg: string;
			fullName: string;
		};
	}[];
	likes: string[];
}

export interface SignUpData {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

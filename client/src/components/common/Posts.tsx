import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "../../types";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
	feedType: string;
	username?: string;
	userId: string;
}

const Posts = ({ feedType, username, userId }: Props) => {
	const getPostEndPoint = () => {
		switch (feedType) {
			case "forYou":
				return `${API_BASE_URL}/api/posts/all`;
			case "following":
				return `${API_BASE_URL}/api/posts/following`;
			case "posts":
				return `${API_BASE_URL}/api/posts/user/${username}`;
			case "likes":
				return `${API_BASE_URL}/api/posts/likes/${userId}`;
			default:
				return `${API_BASE_URL}/api/posts/all`;
		}
	};

	const POST_ENDPOINT = getPostEndPoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery<PostType[]>({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const response = await fetch(POST_ENDPOINT, {
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to create account");
				}

				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;

import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentType, PostType, User } from "../../types";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import { IoMdHeart } from "react-icons/io";
import { Types } from "mongoose";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PostProps {
	post: PostType;
}

const Post = ({ post }: PostProps) => {
	const [comment, setComment] = useState("");

	const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });

	const queryClient = useQueryClient();

	const postOwner = post.user;

	const isLiked = authUser
		? post.likes.includes(authUser._id as unknown as Types.ObjectId)
		: false;

	const isMyPost = authUser && authUser._id === post.user._id;

	const formattedDate = post.createdAt
		? formatPostDate(post.createdAt)
		: "date unknown";

	//DELETE
	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/posts/${post._id}`, {
					method: "DELETE",
					credentials: "include",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	//LIKEPOST
	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/posts/like/${post._id}`,
					{ method: "POST", credentials: "include" },
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		onSuccess: (updatedLikes: Types.ObjectId[]) => {
			//@ts-expect-error: ignore error below
			queryClient.setQueryData<PostType[] | undefined>(["posts"], (oldData) => {
				if (!oldData) {
					return [];
				}
				if (!Array.isArray(oldData)) {
					console.error(oldData);
					return oldData;
				}

				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/posts/comment/${post._id}`,
					{
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ text: comment }),
					},
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		onSuccess: () => {
			toast.success("Comment sent");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},

		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<main className='flex gap-2 items-start p-2.5 lg:p-4 border-b border-gray-700'>
			<div className='avatar'>
				<Link
					to={`/profile/${postOwner.username}`}
					className='w-8 h-8 rounded-full overflow-hidden'>
					<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
				</Link>
			</div>
			<div className='flex flex-col flex-1'>
				<div className='flex gap-2 items-center'>
					<Link to={`/profile/${postOwner.username}`} className='font-bold'>
						{postOwner.fullName}
					</Link>
					<span className='text-gray-700 flex gap-1 text-sm'>
						<Link to={`/profile/${postOwner.username}`}>
							@{postOwner.username}
						</Link>
						<span>·</span>
						<span>{formattedDate}</span>
					</span>
					{isMyPost && (
						<span className='flex justify-end flex-1'>
							{!isDeleting && (
								<div className='dropdown dropdown-left'>
									<div tabIndex={0} role='button' className=''>
										<IoIosMore />
									</div>
									<ul
										tabIndex={0}
										className='dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-fit text-h4'>
										<li>
											<a onClick={handleDeletePost}>Delete</a>
										</li>
									</ul>
								</div>
							)}
						</span>
					)}
				</div>
				<div className='flex flex-col gap-3 overflow-hidden'>
					<span>{post.text}</span>
					{post.img && (
						<img
							src={post.img}
							className='h-80 object-contain rounded-lg border border-gray-700'
							alt=''
						/>
					)}
				</div>
				<div className='flex justify-center mt-3'>
					<div className='flex gap-4 items-center w-2/3 justify-between'>
						<div
							className='flex gap-1 items-center cursor-pointer group'
							onClick={() =>
								(
									document.getElementById(
										"comments_modal" + post._id,
									) as HTMLDialogElement
								)?.showModal()
							}>
							<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
							<span className='text-sm text-slate-500 group-hover:text-sky-400'>
								{post.comments.length}
							</span>
						</div>

						<dialog
							id={`comments_modal${post._id}`}
							className='modal border-none outline-none'>
							<div className='modal-box rounded border border-gray-600'>
								<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
								<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
									{post.comments.length === 0 && (
										<p className='text-sm text-slate-500'>
											No comments yet 🤔 Be the first one 😉
										</p>
									)}
									{post.comments.map((comment: CommentType) => (
										<div
											key={comment._id.toString()}
											className='flex gap-2 items-start'>
											<div className='avatar'>
												<div className='w-8 rounded-full'>
													<img
														src={
															comment.user.profileImg ||
															"/avatar-placeholder.png"
														}
													/>
												</div>
											</div>
											<div className='flex flex-col'>
												<div className='flex items-center gap-1'>
													<span className='font-bold'>
														{comment.user.fullName}
													</span>
													<span className='text-gray-700 text-sm'>
														@{comment.user.username}
													</span>
												</div>
												<div className='text-sm'>{comment.text}</div>
											</div>
										</div>
									))}
								</div>
								<form
									className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
									onSubmit={handlePostComment}>
									<textarea
										className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
										placeholder='Add a comment...'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
										{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
									</button>
								</form>
							</div>
							<form method='dialog' className='modal-backdrop'>
								<button className='outline-none'>close</button>
							</form>
						</dialog>

						<div
							className='flex gap-1 items-center group cursor-pointer'
							onClick={handleLikePost}>
							{isLiking && <LoadingSpinner size='sm' />}
							{!isLiked && (
								<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
							)}
							{isLiked && (
								<IoMdHeart className='w-4 h-4 cursor-pointer text-red-500 ' />
							)}

							<span
								className={`text-sm text-slate-500 group-hover:text-pink-500 ${
									isLiked ? "text-pink-500" : ""
								}`}>
								{post.likes.length}
							</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
export default Post;

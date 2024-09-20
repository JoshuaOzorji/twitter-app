import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types";
import { formatMemberSinceDate } from "../../utils/date";
import { useFollow } from "../../hooks/useFollow";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
	// SCROLL TO TOP
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const [coverImg, setCoverImg] = useState<string | null>(null);

	const [profileImg, setProfileImg] = useState<string | null>(null);

	const [feedType, setFeedType] = useState("posts");

	const coverImgRef = useRef<HTMLInputElement | null>(null);
	const profileImgRef = useRef<HTMLInputElement | null>(null);

	const { username } = useParams();

	// FOLLOW HOOK
	const { follow, isPending } = useFollow();

	// Fetch authenticated user
	const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });

	const { data: userPosts } = useQuery({
		queryKey: ["userPosts"],
		queryFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/posts/user/${username}`,
					{ credentials: "include" },
				);

				const data = await response.json();
				if (!response.ok) {
					throw new Error(
						data.error ||
							"Something went wrong",
					);
				}
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});

	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/users/profile/${username}`,
					{
						credentials: "include",
						method: "GET",
					},
				);

				const data = await response.json();
				if (!response.ok) {
					throw new Error(
						data.error ||
							"Something went wrong",
					);
				}
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

	// PROFILE OWNER
	const isMyProfile = authUser && user && authUser._id === user._id;

	// USER DURATION
	const memberSinceDate = formatMemberSinceDate(user?._id);

	//IF FOLLOWING
	const amIFollowing = authUser?.following.includes(user?._id);

	const handleImgChange = (
		e: ChangeEvent<HTMLInputElement>,
		state: "coverImg" | "profileImg",
	) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (state === "coverImg") {
					setCoverImg(reader.result as string);
				} else if (state === "profileImg") {
					setProfileImg(reader.result as string);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const getImageSrc = (
		img: string | ArrayBuffer | null,
		defaultImg: string,
	) => {
		if (typeof img === "string") {
			return img;
		}
		return defaultImg;
	};

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	return (
		<main className='w-full min-h-screen border-r border-gray-700'>
			{/* HEADER */}
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center '>
					<ProfileHeaderSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && !user && (
				<p className='mt-4 text-lg text-center'>
					User not found
				</p>
			)}
			<div className='flex flex-col'>
				{!isLoading && !isRefetching && user && (
					<section>
						<div className='flex items-center gap-10 px-4 py-2'>
							<Link to='/'>
								<FaArrowLeft className='w-4 h-4' />
							</Link>
							<div className='flex flex-col'>
								<p className='text-lg font-bold'>
									{
										user?.fullName
									}
								</p>
								<span className='text-sm text-slate-500'>
									{
										userPosts?.length
									}{" "}
									posts
								</span>
							</div>
						</div>

						{/* COVER IMG */}
						<div className='relative group/cover '>
							<img
								src={getImageSrc(
									coverImg,
									user?.coverImg ||
										"/cover.png",
								)}
								className='object-cover w-full h-44'
								alt='cover image'
							/>
							{isMyProfile && (
								<div
									className='absolute p-2 transition duration-200 bg-gray-800 bg-opacity-75 rounded-full opacity-0 cursor-pointer top-2 right-2 group-hover/cover:opacity-100'
									onClick={() =>
										coverImgRef.current?.click()
									}>
									<MdEdit className='w-5 h-5 text-white' />
								</div>
							)}

							<input
								type='file'
								hidden
								ref={
									coverImgRef
								}
								onChange={(e) =>
									handleImgChange(
										e,
										"coverImg",
									)
								}
							/>
							<input
								type='file'
								hidden
								ref={
									profileImgRef
								}
								onChange={(e) =>
									handleImgChange(
										e,
										"profileImg",
									)
								}
							/>
							{/* USER AVATAR */}
							<div className='absolute avatar -bottom-14 left-4'>
								<div className='relative rounded-full w-28 group/avatar'>
									<img
										src={getImageSrc(
											profileImg,
											user?.profileImg ||
												"/avatar-placeholder.png",
										)}
										alt='profile image'
									/>
									{isMyProfile && (
										<div
											className='absolute p-2 transition duration-200 bg-gray-800 bg-opacity-75 rounded-full opacity-0 cursor-pointer top-2 right-2 group-hover/cover:opacity-100'
											onClick={() =>
												profileImgRef.current?.click()
											}>
											<MdEdit className='w-5 h-5 text-white' />
										</div>
									)}
								</div>
							</div>
						</div>

						<div className='flex justify-end px-4 mt-5'>
							{isMyProfile ? (
								<EditProfileModal
									authUser={
										authUser
									}
								/>
							) : (
								<button
									className='rounded-full btn btn-outline btn-sm'
									onClick={() =>
										follow(
											user?._id,
										)
									}>
									{isPending
										? "Loading..."
										: amIFollowing
										? "Unfollow"
										: "Follow"}
								</button>
							)}

							{(coverImg ||
								profileImg) && (
								<button
									className='px-4 ml-2 text-white rounded-full btn btn-primary btn-sm'
									onClick={async () => {
										/* eslint-disable @typescript-eslint/no-explicit-any */
										await updateProfile(
											{
												coverImg,
												profileImg,
											} as any,
										);
										setProfileImg(
											null,
										);
										setCoverImg(
											null,
										);
									}}>
									{isUpdatingProfile
										? "Updating..."
										: "Update"}
								</button>
							)}
						</div>

						<div className='flex flex-col gap-4 px-4 my-3'>
							<div className='flex flex-col'>
								<span className='text-lg font-bold'>
									{
										user?.fullName
									}
								</span>
								<span className='text-sm text-slate-500'>
									@
									{
										user?.username
									}
								</span>
								<span className='my-1 text-sm'>
									{
										user?.bio
									}
								</span>
							</div>

							<div className='flex flex-wrap gap-2'>
								{user?.link && (
									<div className='flex items-center gap-1 '>
										<>
											<FaLink className='w-3 h-3 text-slate-500' />
											<a
												target='_blank'
												rel='noreferrer'
												className='text-sm text-blue-500 hover:underline'>
												{
													user?.link
												}
											</a>
										</>
									</div>
								)}
								<div className='flex items-center gap-2'>
									<IoCalendarOutline className='w-4 h-4 text-slate-500' />
									<span className='text-sm text-slate-500'>
										{
											memberSinceDate
										}
									</span>
								</div>
							</div>
							<div className='flex gap-4'>
								<div className='flex items-center gap-1'>
									<span className='text-xs font-bold'>
										{
											user
												?.following
												.length
										}
									</span>
									<span className='text-xs text-slate-500'>
										Following
									</span>
								</div>
								<div className='flex items-center gap-1'>
									<span className='text-xs font-bold'>
										{
											user
												?.followers
												.length
										}
									</span>
									<span className='text-xs text-slate-500'>
										Followers
									</span>
								</div>
							</div>
						</div>

						<div className='flex w-full border-b border-gray-700'>
							<div
								className='relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary'
								onClick={() =>
									setFeedType(
										"posts",
									)
								}>
								Posts
								{feedType ===
									"posts" && (
									<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
								)}
							</div>
							<div
								className='relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer text-slate-500 hover:bg-secondary'
								onClick={() =>
									setFeedType(
										"likes",
									)
								}>
								Likes
								{feedType ===
									"likes" && (
									<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
								)}
							</div>
						</div>
					</section>
				)}

				<Posts
					feedType={feedType}
					username={username}
					userId={user?._id}
				/>
			</div>
		</main>
	);
};
export default ProfilePage;

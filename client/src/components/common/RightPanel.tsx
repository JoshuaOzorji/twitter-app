import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useFollow } from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type UserType = {
	_id: string;
	username: string;
	fullName: string;
	profileImg?: string;
};

const RightPanel = () => {
	const { data: suggestedUsers, isLoading } = useQuery<UserType[]>({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/users/suggested`, {
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
	});

	const { follow } = useFollow();

	const [pendingUserId, setPendingUserId] = useState<string | null>(null);

	const handleFollow = (userId: string) => {
		setPendingUserId(userId);
		follow(userId, {
			onSettled: () => {
				setPendingUserId(null);
			},
		});
	};

	if (suggestedUsers?.length === 0) return <div className=''></div>;

	return (
		<div className='w-full mx-2'>
			<div className='bg-[#16181C] lg:p-3 xl:p-4 rounded-md sticky my-4'>
				<p className='font-bold mb-3'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* lOADING */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}

					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='grid grid-cols-3'
								key={user._id}>
								<div className='flex gap-2 items-center col-span-2'>
									<div className='avatar'>
										<div className='w-7 h-7 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tighter truncate text-sm'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>
											@{user.username}
										</span>
									</div>
								</div>

								<button
									className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm col-span-1'
									onClick={(e) => {
										e.preventDefault();
										handleFollow(user._id);
									}}>
									{pendingUserId === user._id ? (
										<LoadingSpinner size='sm' />
									) : (
										"Follow"
									)}
								</button>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;

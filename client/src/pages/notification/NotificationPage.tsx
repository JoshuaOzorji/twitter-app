import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "../../types";
import toast from "react-hot-toast";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type NotificationResponse = {
	notifications: Notification[];
	notificationCount: number;
};

const NotificationPage = () => {
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<NotificationResponse>({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/notifications`, {
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

	const notifications = data?.notifications;

	const { mutate: notificationsRead } = useMutation({
		mutationFn: async () => {
			const response = await fetch(`${API_BASE_URL}/api/notifications/read`, {
				method: "POST",
				credentials: "include",
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	useEffect(() => {
		notificationsRead();
	}, [notificationsRead]);

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/notifications`, {
					method: "DELETE",
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeleteNotifications = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		event.preventDefault();
		deleteNotifications();
	};

	return (
		<div className='border-l border-r border-gray-700 min-h-screen'>
			<div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<p className='font-bold'>Notifications</p>

				{notifications && notifications?.length > 0 && (
					<div className='dropdown dropdown-bottom dropdown-end'>
						<div tabIndex={0} role='button' className=' m-1'>
							<IoSettingsOutline className='w-4 h-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
							<li>
								<a onClick={handleDeleteNotifications}>
									Delete all notifications
								</a>
							</li>
						</ul>
					</div>
				)}
			</div>

			{/* LOADING */}
			{isLoading && (
				<div className='flex justify-center h-full items-center'>
					<LoadingSpinner size='lg' />
				</div>
			)}
			{notifications?.length === 0 && (
				<div className='text-center p-4 font-bold'>No notifications 🤔</div>
			)}
			{notifications?.map((notification) => (
				<div className='border-b border-gray-700' key={notification._id}>
					<div className='flex gap-2 p-3'>
						{notification.type === "follow" && (
							<FaUser className='w-5 h-5 text-primary' />
						)}
						{notification.type === "like" && (
							<IoMdHeart className='w-5 h-5 text-red-500' />
						)}

						<Link to={`/profile/${notification.from.username}`}>
							<div className='avatar'>
								<div className='w-7 h-7 md:w-8 md:h-8 rounded-full'>
									<img
										src={
											notification.from.profileImg || "/avatar-placeholder.png"
										}
									/>
								</div>
							</div>
							<div className='flex gap-1'>
								<span className='font-bold'>@{notification.from.username}</span>{" "}
								{notification.type === "follow"
									? "followed you"
									: "liked your post"}
							</div>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};
export default NotificationPage;

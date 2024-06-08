import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { RiNotification4Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User } from "../../types";
import { BiSolidUser } from "react-icons/bi";
import { NotificationResponse } from "../../pages/notification/NotificationPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sidebar = () => {
	const queryClient = useQueryClient();

	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
					method: "POST",
					credentials: "include",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["authUser"],
			});
			toast.success("Logout successfully completed");
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });

	const { data } = useQuery<NotificationResponse>({
		queryKey: ["notificationsCount"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/api/notifications`, {
				credentials: "include",
			});
			const data = await response.json();
			return data;
		},
		refetchOnWindowFocus: true,
	});

	const notifications = data?.notificationCount;

	return (
		<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 justify-between items-center py-4'>
			<div>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-10 h-10 md:w-11 md:h-11 rounded-full fill-white hover:bg-stone-900 animate' />
				</Link>

				<ul className='flex flex-col mt-4 items-center space-y-2'>
					<Link
						to='/'
						className='flex items-center hover:bg-stone-900 transition-all duration-300 rounded-full cursor-pointer p-2 animate'>
						<MdHomeFilled className='w-6 h-6 md:h-7 md:w-7' />
					</Link>

					<Link
						to='/notifications'
						className='flex items-center hover:bg-stone-900 transition-all rounded-full duration-300 cursor-pointer p-2 animate relative'>
						<RiNotification4Fill className='w-6 h-6 md:h-7 md:w-7' />
						{notifications !== undefined && notifications > 0 && (
							<span className='absolute top-1 right-2 bg-blue-600 text-white rounded-full px-1 text-xs'>
								{notifications}
							</span>
						)}
					</Link>

					<Link
						to={`/profile/${authUser?.username}`}
						className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 cursor-pointer p-2 animate'>
						<BiSolidUser className='w-6 h-6 md:h-7 md:w-7' />
					</Link>
				</ul>
			</div>

			{authUser && (
				<section className='dropdown dropdown-top'>
					<div tabIndex={0} role='button' className=''>
						<img
							src={authUser?.profileImg || "/avatar-placeholder.png"}
							className='rounded-full w-10 h-10 md:h-12 md:w-12 hover:bg-stone-900 p-2'
						/>
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu p-3 bg-base-100 w-52 border rounded-lg space-y-1 font-bold shadow-stone-700 shadow-md'>
						<Link to={`/profile/${authUser.username}`}>Profile</Link>
						<div className='divider'></div>
						<li
							className='cursor-pointer'
							onClick={(e) => {
								e.preventDefault();
								logout();
							}}>
							Logout @{authUser.username}
						</li>
					</ul>
				</section>
			)}
		</div>
	);
};

export default Sidebar;

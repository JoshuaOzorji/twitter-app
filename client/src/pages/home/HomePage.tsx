import { useEffect, useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	// SCROLL TO TOP
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className='border-gray-700 min-h-screen w-full border-r'>
			{/* Header */}
			<div className='flex w-full border-b border-gray-700'>
				<div
					className={
						"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
					}
					onClick={() => setFeedType("forYou")}>
					For you
					{feedType === "forYou" && (
						<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
					)}
				</div>
				<div
					className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
					onClick={() => setFeedType("following")}>
					Following
					{feedType === "following" && (
						<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
					)}
				</div>
			</div>

			{/*  CREATE POST INPUT */}
			<CreatePost />

			{/* POSTS */}
			<Posts feedType={feedType} />
		</div>
	);
};
export default HomePage;

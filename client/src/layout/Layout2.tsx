import { Outlet } from "react-router-dom";

const Layout2 = () => {
	return (
		<div className='w-full h-screen flex justify-center items-center'>
			<Outlet />
		</div>
	);
};

export default Layout2;

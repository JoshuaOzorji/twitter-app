import LoadingSpinner from "../components/common/LoadingSpinner";
import RightPanel from "../components/common/RightPanel";
import Sidebar from "../components/common/Sidebar";
import { useAuthUser } from "../hooks/AuthApi";

type Props = {
	children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
	const { authUser, isLoading } = useAuthUser();

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}
	return (
		<main className='w-full lg:w-[75%] flex flex-row mx-auto relative '>
			<div className='w-[10%] lg:w-[7%] z-50'>{authUser && <Sidebar />}</div>

			<div className='flex-1 w-[90%] lg:w-[64%]'>{children}</div>

			<div className='hidden lg:inline-block lg:w-[29%]  '>
				{authUser && <RightPanel />}
			</div>
		</main>
	);
};

export default Layout;

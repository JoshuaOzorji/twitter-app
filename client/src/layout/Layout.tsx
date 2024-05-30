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
		<main className='w-[80%] flex mx-auto'>
			<div className='w-[15%]'>{authUser && <Sidebar />}</div>

			<div className='w-[60%]'>{children}</div>

			<div className='w-[25%]'>{authUser && <RightPanel />}</div>
		</main>
	);
};

export default Layout;
